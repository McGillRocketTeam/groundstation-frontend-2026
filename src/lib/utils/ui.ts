import { clsx, type ClassValue } from "clsx";
import { Option, SchemaAST, type Schema } from "effect";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TitleAnnotation = Symbol.for("effect/annotation/Title");
const DescriptionAnnotation = Symbol.for("effect/annotation/Description");

export const annotations = <A, I, R>(schema: Schema.Schema<A, I, R>) => ({
  title: SchemaAST.getAnnotation<string>(TitleAnnotation)(schema.ast).pipe(
    Option.getOrUndefined,
  ),
  description: SchemaAST.getAnnotation<string>(DescriptionAnnotation)(
    schema.ast,
  ).pipe(Option.getOrUndefined),
});
