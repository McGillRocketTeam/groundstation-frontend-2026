import { clsx, type ClassValue } from "clsx";
import { Option, Schema, SchemaAST } from "effect";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TitleAnnotation = Symbol.for("effect/annotation/Title");
const DescriptionAnnotation = Symbol.for("effect/annotation/Description");

type WithAst = Pick<Schema.Schema<any, any, any>, "ast">;

export const annotations = (schema: WithAst) => ({
  title: SchemaAST.getAnnotation<string>(TitleAnnotation)(schema.ast).pipe(
    Option.getOrUndefined,
  ),
  description: SchemaAST.getAnnotation<string>(DescriptionAnnotation)(
    schema.ast,
  ).pipe(Option.getOrUndefined),
});
