import { TextCard } from "./text-card";

import { CardConfiguration } from "@/lib/cards/card-configuration";
import { Schema } from "effect";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  ...CardConfiguration.fields,
  text: Schema.String,
});

export { TextCard, TextCardConfiguration };
