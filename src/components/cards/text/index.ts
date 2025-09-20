import { Schema } from "effect";
import { TextCard } from "./text-card";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String.pipe(Schema.minLength(5)).annotations({
    title: "Body Text",
  }),
}).annotations({ title: "Text Card" });

export { TextCard, TextCardConfiguration };
