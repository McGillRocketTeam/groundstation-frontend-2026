import { Schema } from "effect";
import { ButtonCard } from "./button-card";

const ButtonCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String,
});

export { ButtonCard, ButtonCardConfiguration };
