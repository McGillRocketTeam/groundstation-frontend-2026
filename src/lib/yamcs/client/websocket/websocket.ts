import {
  Cause,
  Chunk,
  Duration,
  Effect,
  Option,
  ParseResult,
  pipe,
  Schedule,
  Schema,
  Stream,
} from "effect";
import { makeCounter } from "./counter";
import { eventHandlers } from "./event-handlers";
import * as ServerMessage from "./server-messages";
import { YamcsSubscriptionManager } from "./subscription-manager";

export class YamcsWebsocketSubscription extends Effect.Service<YamcsWebsocketSubscription>()(
  "YamcsWebsocketSubscription",
  {
    accessors: true,
    dependencies: [YamcsSubscriptionManager.Default],
    effect: Effect.gen(function* () {
      const subscriptionManager = yield* YamcsSubscriptionManager;

      const setup = Effect.gen(function* () {
        const wsUrl = "ws://localhost:8090/api/websocket";
        const ws = new WebSocket(wsUrl);
        const counter = yield* makeCounter(1);

        yield* Effect.logInfo("Attempting to connect to YAMCS WebsSocket").pipe(
          Effect.annotateLogs({ url: wsUrl }),
        );

        // Websocket will be closed when the Effect's scope ends
        yield* Effect.addFinalizer(() => Effect.sync(() => ws.close()));

        ws.onopen = () => {
          const id = Effect.runSync(counter.get);
          ws.send(JSON.stringify({ id, type: "status" }));
        };

        const source = yield* Stream.async<
          ServerMessage.Messages | null,
          Cause.TimeoutException
        >((emit) => {
          ws.addEventListener("message", (e) => {
            void emit(
              pipe(
                JSON.parse(e.data),
                Schema.decodeUnknown(ServerMessage.Messages),
                Effect.map((data) => Chunk.make(data)),
                // We weren't able to parse a message from the server
                Effect.tapErrorTag("ParseError", (error) =>
                  Effect.logError(
                    "Unable to parse WebSocket Message",
                    ParseResult.TreeFormatter.formatErrorSync(error),
                  ),
                ),
                Effect.catchTag("ParseError", () =>
                  Effect.succeed(Chunk.make(null)),
                ),
              ),
            );
          });

          ws.addEventListener("error", () => {
            void emit(Effect.fail(Option.some(new Cause.TimeoutException())));
          });

          // If the websocket closes, we want to re-establish connection as fast as possible.
          // There's never a scenario where the frontend is running without the WS
          ws.addEventListener("close", () => {
            void emit(Effect.fail(Option.some(new Cause.TimeoutException())));
          });
        }).pipe(Stream.share({ capacity: "unbounded" }));

        const connectionAckLatch = yield* Effect.makeLatch(false);

        // When we open the conneciton, we send a state message
        // as a ping. Here we wait to see if we recieve the state.
        const connectionAckStream = source.pipe(
          Stream.filter(Schema.is(ServerMessage.Reply)),
          Stream.take(1),
          Stream.timeoutFail(
            () => new Cause.TimeoutException("connection_ack"),
            "5 seconds",
          ),
          Stream.tap(() => connectionAckLatch.open),
        );

        // Set up the streams once the latch has been opened
        // aka connection has been established
        yield* connectionAckLatch
          .whenOpen(
            Effect.gen(function* () {
              const subscribeToChannels = Effect.forEach(
                eventHandlers,
                (handler) => subscriptionManager.subscribe({ handler, ws }),
                { concurrency: "unbounded" },
              );

              yield* Effect.all([subscribeToChannels], { mode: "validate" });
            }),
          )
          .pipe(Effect.forkScoped);

        const replyStream = source.pipe(
          Stream.filter(Schema.is(ServerMessage.Reply)),
          Stream.tap((event) =>
            subscriptionManager.confirmSubscription(
              event.data.replyTo!,
              event.call!,
            ),
          ),
        );

        const eventStream = source.pipe(
          Stream.filter(Schema.is(ServerMessage.Events)),
          Stream.tap((event) =>
            subscriptionManager.handleEvent(event.call, event.data),
          ),
        );

        yield* Stream.merge(eventStream, connectionAckStream).pipe(
          Stream.merge(replyStream),
          Stream.runDrain,
        );
      }).pipe(
        Effect.scoped,
        Effect.catchAllCause(() => new Cause.TimeoutException()),
        Effect.retry({
          schedule: Schedule.jittered(
            Schedule.exponential("300 millis", 1.25).pipe(
              // The retry will back off exponentially until 2 seconds
              Schedule.map((duration) => Duration.min(duration, "2 seconds")),
            ),
          ),
        }),
        Effect.onInterrupt(() =>
          Effect.logWarning("WebSocket connection interrupted"),
        ),
      );

      return { setup };
    }),
  },
) {}
