import { Effect, Schema } from "effect";
import { createEventHandler } from "./event-handler";

const timeHandler = ({ instance }: { instance: string }) =>
  createEventHandler({
    type: "time",
    schema: Schema.Struct({
      value: Schema.DateFromSelf,
    }),
    options: {
      instance,
    },
    handle: (data) => Effect.logInfo(data.value.toString()),
  });

export const eventHandlers = [
  timeHandler({ instance: "mqtt-frames" }),
] as const;

export type LiveEventHandler = (typeof eventHandlers)[number];
