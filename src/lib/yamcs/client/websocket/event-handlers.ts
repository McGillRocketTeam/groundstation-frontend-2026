import { Effect, Schema } from "effect";
import { createEventHandler } from "./event-handler";

const linksHandler = ({ instance }: { instance: string }) =>
  createEventHandler({
    type: "links",
    schema: Schema.Struct({
      links: Schema.Array(
        Schema.Struct({
          instance: Schema.String,
          name: Schema.String,
          type: Schema.String,
          disabled: Schema.Boolean,
          status: Schema.String,
          dataInCount: Schema.NumberFromString,
          dataOutCount: Schema.NumberFromString,
          // detailedStatus: Schema.String,
          parentName: Schema.optional(Schema.String),
          parameters: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    }),
    options: {
      instance,
    },
    // handle: (data) => Effect.logInfo("Got Link Data", data),
    handle: () => Effect.void,
  });

const timeHandler = ({ instance }: { instance: string }) =>
  createEventHandler({
    type: "time",
    schema: Schema.Struct({
      value: Schema.DateFromString,
    }),
    options: {
      instance,
    },
    // handle: (data) => Effect.logInfo("Got Time", data),
    handle: () => Effect.void,
  });

export const eventHandlers = [
  timeHandler({ instance: "mqtt-frames" }),
  linksHandler({ instance: "mqtt-frames" }),
] as const;

export type LiveEventHandler = (typeof eventHandlers)[number];
