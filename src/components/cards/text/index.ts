import { Schema } from "effect";
import { TextCard } from "./text-card";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String,
});

export { TextCard, TextCardConfiguration };
