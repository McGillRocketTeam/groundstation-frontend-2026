import { connectionStatusAtom } from "@/lib/atoms/connection-status";
import { Atom } from "@effect-atom/atom-react";
import { Chunk, Effect, Logger, Schema, Stream, StreamEmit } from "effect";
import {
  Cancel,
  SubscribeLinksRequest,
  SubscribeTimeRequest,
  type SubscriptionRequest,
} from "./client-messages";
import {
  Events,
  LinkEvent,
  Reply,
  Messages as ServerMessages,
  SubscriptionId,
  TimeEvent,
} from "./server-messages";

Atom.runtime.addGlobalLayer(Logger.pretty);

class WebSocketClient extends Effect.Service<WebSocketClient>()(
  "WebSocketClient",
  {
    accessors: true,
    dependencies: [],
    scoped: Effect.gen(function* () {
      let id = SubscriptionId.make(1);

      // Socket will be automatically closed when the scope ends.
      const ws = yield* Effect.acquireRelease(
        Effect.gen(function* () {
          yield* Atom.set(connectionStatusAtom, "connected");
          return yield* Effect.try(
            () => new WebSocket("ws://localhost:8090/api/websocket"),
          );
        }),
        (ws) =>
          Effect.gen(function* () {
            yield* Atom.set(connectionStatusAtom, "disconnected");
            yield* Effect.log("Closing Websocket");
            yield* Effect.sync(() => {
              ws.close();
            });
          }),
      );

      // Wait for the open event
      yield* Effect.async((resume) => {
        ws.addEventListener("open", (event) => {
          ws.send(JSON.stringify({ id, type: "status" }));
          id++;

          resume(
            Effect.gen(function* () {
              yield* Effect.log("WebSocket Opened");
              yield* Effect.succeed(event);
            }),
          );
        });
      });

      const messages = Stream.async(
        (emit: StreamEmit.Emit<never, never, string, void>) => {
          ws.addEventListener("message", (event: MessageEvent<string>) => {
            emit(Effect.succeed(Chunk.of(event.data)));
          });
        },
      ).pipe(
        Stream.filterMap((m) =>
          Schema.decodeOption(ServerMessages)(JSON.parse(m)),
        ),
      );

      yield* messages.pipe(
        Stream.runForEachScoped((message) =>
          Effect.logDebug(`Websocket Message (${message.type})`, message),
        ),
        Effect.forkScoped,
      );

      const send = (data: Record<string, any>) =>
        Effect.gen(function* () {
          const messageId = id++;
          yield* Effect.logDebug(`Sending Message ${data.type}`, data);
          yield* Effect.sync(() =>
            ws.send(JSON.stringify({ ...data, id: messageId })),
          );

          // we wait in this effect until we get a reply with the call id
          // this way we can return it and know the call id for future messages.
          const replyMessage = yield* messages.pipe(
            Stream.filter(Schema.is(Reply)),
            Stream.filter((m) => m.data.replyTo === messageId),
            Stream.takeUntil(
              (m) => m.type === "reply" && m.data.replyTo === messageId,
            ),
            Stream.runCollect,
          );

          const reply = Chunk.toReadonlyArray(replyMessage)[0];

          if (reply.data.exception) {
            yield* Effect.logError(
              `${reply.data.exception.code} ${reply.data.exception.type} for type "${data.type}"`,
              reply.data.exception.msg,
            );
          }

          return reply.call!;
        });

      const subscribe = Effect.fnUntraced(function* (
        request: typeof SubscriptionRequest.Type,
      ) {
        const { _tag, ...data } = request;

        const call = yield* send({
          type: _tag,
          options: data,
        });

        const stream = messages.pipe(
          Stream.filter(Schema.is(Events)),
          Stream.filter((s) => s.call === call),
        );

        return { call, stream };
      });

      const unsubscribe = Effect.fnUntraced(function* (call: SubscriptionId) {
        yield* Effect.sync(() =>
          ws.send(
            JSON.stringify(
              Cancel.make({
                type: "cancel",
                options: { call },
              }),
            ),
          ),
        );
      });

      return { messages, send, subscribe, unsubscribe };
    }),
  },
) {}

const yamcsRuntime = Atom.runtime(WebSocketClient.Default);

export const timeSubscriptionAtom = yamcsRuntime.atom(
  Stream.unwrap(
    Effect.gen(function* () {
      const ws = yield* WebSocketClient;

      const { call, stream } = yield* ws.subscribe(
        SubscribeTimeRequest.make({
          instance: "mqtt-frames",
          processor: "realtime",
        }),
      );

      return stream.pipe(
        Stream.mapEffect((m) => Schema.decodeUnknown(TimeEvent)(m)),
        Stream.map((m) => m.data),
        Stream.ensuring(ws.unsubscribe(call)),
      );
    }),
  ),
);

export const linksSubscriptionAtom = yamcsRuntime.atom(
  Stream.unwrap(
    Effect.gen(function* () {
      const ws = yield* WebSocketClient;

      const { call, stream } = yield* ws.subscribe(
        SubscribeLinksRequest.make({ instance: "mqtt-frames" }),
      );

      return stream.pipe(
        Stream.mapEffect((m) => Schema.decodeUnknown(LinkEvent)(m)),
        Stream.map((m) => m.data.links),
        Stream.ensuring(ws.unsubscribe(call)),
      );
    }),
  ),
);

export const websocketAtom = Atom.family(
  (type: typeof SubscriptionRequest.Type) =>
    yamcsRuntime.atom(
      Stream.unwrap(
        Effect.gen(function* () {
          const ws = yield* WebSocketClient;
          return (yield* ws.subscribe(type)).stream;
        }),
      ),
    ),
);
