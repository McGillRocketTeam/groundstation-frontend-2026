import { Effect, Schema } from "effect";
import { createEventHandler } from "./event-handler";

const timeHandler = createEventHandler({
  type: "time",
  schema: Schema.Struct({
    value: Schema.Date,
  }),
  handle: (data) => Effect.log(data),
});

export const eventHandlers = [timeHandler] as const;
export type LiveEventHandler = (typeof eventHandlers)[number];
