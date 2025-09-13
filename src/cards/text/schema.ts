import { CardConfiguration } from "@/lib/cards/card-configuration";
import { Schema } from "effect";

export const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
	...CardConfiguration.fields,
	text: Schema.String
})

