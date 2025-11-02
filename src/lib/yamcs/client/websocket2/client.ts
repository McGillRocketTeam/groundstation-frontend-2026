import { Atom } from "@effect-atom/atom-react";
import { Chunk, Effect, Logger, Schema, Stream, StreamEmit } from "effect";
import type { QualifiedName } from "../types";

Atom.runtime.addGlobalLayer(Logger.pretty);

// const [name, value] = useParameterAtom("/Qualified/Parameter/name")
//
// const useParameterAtom = Atom.family((parameter: string) => yamcsRuntime.atom(
//	Effect.gen(function*() {
//		const yamcs = yield* Yamcs
//		return yamcs.parameterSubscription(parameter)
//	})
// ))

const ServerMessage = Schema.Struct({
  type: Schema.String,
  call: Schema.optional(Schema.Number),
  seq: Schema.optional(Schema.Number),
  data: Schema.optional(Schema.Any),
});

class WebSocketClient extends Effect.Service<WebSocketClient>()(
  "WebSocketClient",
  {
    dependencies: [],
    scoped: Effect.gen(function* () {
      let id = 0;
      // Socket will be automatically closed when the scope ends.
      const ws = yield* Effect.acquireRelease(
        Effect.try(() => new WebSocket("ws://localhost:8090/api/websocket")),
        (ws) =>
          Effect.gen(function* () {
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
          Schema.decodeOption(ServerMessage)(JSON.parse(m)),
        ),
      );

      yield* messages.pipe(
        Stream.runForEachScoped((message) =>
          Effect.logInfo("Websocket Message", message),
        ),
        Effect.forkScoped,
      );

      const send = (data: Record<string, any>) =>
        Effect.gen(function* () {
          yield* Effect.log("Sending Message", data);
          yield* Effect.sync(() => ws.send(JSON.stringify({ ...data, id })));
          const replyMessage = yield* messages.pipe(
            Stream.takeUntil(
              (m) => m.type === "reply" && m.data.replyTo === id,
            ),
            Stream.runCollect,
          );
          id++;

          const call = Chunk.toReadonlyArray(replyMessage).at(-1)!;
          yield* Effect.log(`${id} Returning call ${call.call}`, call);

          return call.call!;
        });

      const subscribe = Effect.fnUntraced(function* (
        qualifiedName: QualifiedName,
      ) {
        const call = yield* send({
          type: qualifiedName,
          options: {
            instance: "mqtt-frames",
            ...(qualifiedName === "time" ? { processor: "realtime" } : {}),
          },
          // type: "parameters",
          // options: {
          //   instance: "mqtt-frames",
          //   processor: "realtime",
          //   id: [qualifiedName],
          // },
        });

        return messages.pipe(Stream.filter((s) => s.call === call));
      });

      return { messages, send, subscribe };
    }),
  },
) {}

const yamcsRuntime = Atom.runtime(WebSocketClient.Default);

export const websocketAtom = Atom.family((type: string) =>
  yamcsRuntime.atom(
    Stream.unwrap(
      Effect.gen(function* () {
        const ws = yield* WebSocketClient;
        return yield* ws.subscribe(type);
      }),
    ),
  ),
);
