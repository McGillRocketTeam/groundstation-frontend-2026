import { Schema } from "effect";
import { TextCard } from "./text-card";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String,
}).annotations({ title: "Text Card" });

export { TextCard, TextCardConfiguration };
