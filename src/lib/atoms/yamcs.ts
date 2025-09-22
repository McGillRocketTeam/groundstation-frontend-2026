import { Atom } from "@effect-atom/atom-react";
import { Effect, Layer, Logger } from "effect";
import { YamcsWebsocketSubscription } from "../yamcs/client/websocket/websocket";

const atomRuntime = Atom.runtime(
  Layer.mergeAll(YamcsWebsocketSubscription.Default, Logger.pretty),
);

export const yamcsWebsocketAtom = atomRuntime.atom(
  Effect.gen(function* () {
    const websocket = yield* YamcsWebsocketSubscription;
    return yield* websocket.setup;
  }),
);
