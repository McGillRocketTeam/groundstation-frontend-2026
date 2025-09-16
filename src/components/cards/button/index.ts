import { Schema } from "effect";
import { ButtonCard } from "./button-card";

const ButtonCardConfiguration = Schema.TaggedStruct("ButtonCard", {
  test: Schema.String,
}).annotations({ title: "Button Card" });

export { ButtonCard, ButtonCardConfiguration };
