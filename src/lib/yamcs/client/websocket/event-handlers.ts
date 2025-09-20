import { Effect, Schema } from "effect";
import { createEventHandler } from "./event-handler";

const linksHandler = ({ instance }: { instance: string }) =>
  createEventHandler({
    type: "links",
    schema: Schema.Struct({
      instance: Schema.String,
      name: Schema.String,
      type: Schema.String,
      spec: Schema.String,
      disabled: Schema.Boolean,
      status: Schema.String,
      dataInCount: Schema.NumberFromString,
      dataOutCount: Schema.NumberFromString,
      detailedStatus: Schema.String,
      parentName: Schema.optional(Schema.String),
      parameters: Schema.Array(Schema.String),
    }),
    options: {
      instance,
    },
    handle: (data) => Effect.logInfo(data),
  });

const timeHandler = ({ instance }: { instance: string }) =>
  createEventHandler({
    type: "time",
    schema: Schema.Struct({
      links: Schema.Array(
        Schema.Struct({
          value: Schema.DateFromSelf,
        }),
      ),
    }),
    options: {
      instance,
    },
    handle: (data) => Effect.logInfo(data),
  });

export const eventHandlers = [
  timeHandler({ instance: "mqtt-frames" }),
  linksHandler({ instance: "mqtt-frames" }),
] as const;

export type LiveEventHandler = (typeof eventHandlers)[number];
