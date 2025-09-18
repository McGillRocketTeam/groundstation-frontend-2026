import {
  Cause,
  Effect,
  HashMap,
  Option,
  ParseResult,
  PubSub,
  Ref,
  Schedule,
  Schema,
  Stream,
} from "effect";
import { makeCounter } from "./counter";
import type { LiveEventHandler } from "./event-handlers";
import { SubscriptionId } from "./server-messages";

export class YamcsSubscriptionManager extends Effect.Service<YamcsSubscriptionManager>()(
  "YamcsSubscriptionManager",
  {
    effect: Effect.gen(function* () {
      const subscriptionRequests = yield* Ref.make(
        HashMap.empty<SubscriptionId, LiveEventHandler>(),
      );
      const subscriptions = yield* Ref.make(
        HashMap.empty<SubscriptionId, LiveEventHandler>(),
      );
      const successPubSub = yield* PubSub.unbounded<{
        requestId: SubscriptionId;
        callId: SubscriptionId;
      }>();
      const counter = yield* makeCounter(2);

      const subscribe = ({
        handler,
        ws,
      }: {
        handler: LiveEventHandler;
        ws: WebSocket;
      }) =>
        Effect.gen(function* () {
          const idNumber = yield* counter.get;
          const id = SubscriptionId.make(idNumber);
          yield* counter.inc;

          yield* Ref.update(subscriptionRequests, (map) =>
            HashMap.set(map, id, handler),
          );
          // right after setting the hashmap the size is still 0

          const sendSubscribe = Effect.sync(() => {
            ws.send(
              JSON.stringify({
                type: handler.type,
                id,
                options: {
                  instance: "mqtt-frames",
                },
              }),
            );
          }).pipe(
            Effect.flatMap(() =>
              Effect.logInfo(`Sent subscription request for ${handler.type}`),
            ),
            Effect.annotateLogs({ id }),
          );

          yield* Effect.addFinalizer(() =>
            Effect.sync(() => {
              ws.send(
                JSON.stringify({
                  type: "cancel",
                  options: {
                    call: id,
                  },
                }),
              );
              Effect.runSync(
                Ref.update(subscriptions, (map) => HashMap.remove(map, id)),
              );
            }),
          );

          const waitForConfirmation = Stream.fromPubSub(successPubSub).pipe(
            Stream.filter(({ requestId }) => requestId === id),
            Stream.take(1),
            Stream.tap(({ callId }) =>
              Effect.gen(function* () {
                const sub = yield* Ref.get(subscriptionRequests).pipe(
                  Effect.map((map) => HashMap.get(map, id)),
                );
                if (Option.isNone(sub)) {
                  Effect.logError("Couldn't find subscriptionRequest");
                  return;
                }

                yield* Ref.update(subscriptions, (map) =>
                  HashMap.set(map, callId, handler),
                );

                yield* Ref.update(subscriptionRequests, (map) =>
                  HashMap.remove(map, id),
                );
              }),
            ),
            Stream.tap(({ callId }) =>
              Effect.logInfo(
                `Successfully subscribed to "${handler.type}"`,
              ).pipe(Effect.annotateLogs({ id, callId })),
            ),
            Stream.timeoutFail(() => new Cause.TimeoutException(), "5 seconds"),
            Stream.tapError(() =>
              Effect.logInfo(
                `Failed to subscribe to ${handler.type} with ID ${id}`,
              ),
            ),
            Stream.runDrain,
          );

          return yield* Effect.zip(sendSubscribe, waitForConfirmation).pipe(
            Effect.retry({
              schedule: Schedule.addDelay(
                Schedule.recurs(5),
                () => "500 millis",
              ),
            }),
          );
        });

      const confirmSubscription = (id: SubscriptionId, call: SubscriptionId) =>
        Effect.gen(function* () {
          yield* PubSub.publish(successPubSub, {
            requestId: id,
            callId: call,
          });
        });

      const handleEvent = (call: SubscriptionId, event: unknown) =>
        Effect.gen(function* () {
          const sub = yield* Ref.get(subscriptions).pipe(
            Effect.map((map) => HashMap.get(map, call)),
          );
          if (Option.isNone(sub)) return;

          const payload = yield* Effect.option(
            Schema.decodeUnknown(sub.value.schema)(event).pipe(
              Effect.tapErrorTag("ParseError", (error) =>
                Effect.logError(
                  `Unable to parse WebSocket message for type "${sub.value.type}"`,
                  ParseResult.TreeFormatter.formatErrorSync(error),
                ),
              ),
            ),
          );
          if (Option.isNone(payload)) return;

          yield* sub.value.handle(payload.value);
        });

      return { subscribe, confirmSubscription, handleEvent };
    }),
  },
) {}
