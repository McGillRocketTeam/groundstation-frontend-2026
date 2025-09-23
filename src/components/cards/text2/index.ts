import { Schema } from "effect";
import { TextCard2 } from "./text-card2";

const TextCard2Configuration = Schema.TaggedStruct("TextCard2", {
  text: Schema.String.pipe(Schema.minLength(5)).annotations({
    title: "Body Text",
  }),
}).annotations({ title: "Text Card 2" });

export { TextCard2, TextCard2Configuration };
