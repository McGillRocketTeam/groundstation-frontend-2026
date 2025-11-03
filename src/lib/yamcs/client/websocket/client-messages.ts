import { Schema } from "effect";

/*     Built-in Client Messages     */
export const Cancel = Schema.Struct({
  type: Schema.Literal("cancel"),
  options: Schema.Struct({
    call: Schema.NonNegativeInt,
  }),
});

export const State = Schema.Struct({
  type: Schema.Literal("state"),
});

export const SubscribeTimeRequest = Schema.TaggedStruct("time", {
  instance: Schema.String,
  processor: Schema.String,
});

export const SubscribeLinksRequest = Schema.TaggedStruct("links", {
  instance: Schema.String,
});

export const SubscribeCommandsRequest = Schema.TaggedStruct("commands", {
  instance: Schema.String,
  processor: Schema.String,
  ingorePastCommands: Schema.optional(Schema.Boolean),
});

export const SubscriptionRequest = Schema.Union(
  SubscribeTimeRequest,
  SubscribeLinksRequest,
  SubscribeCommandsRequest,
);
