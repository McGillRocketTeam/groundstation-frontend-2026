import { Schema } from "effect";

export const CardConfiguration = Schema.Struct({
	title: Schema.NonEmptyString,
})
