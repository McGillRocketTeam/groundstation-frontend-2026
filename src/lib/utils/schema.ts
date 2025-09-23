import * as Schema from "effect/Schema";
import * as AST from "effect/SchemaAST";

type FieldInfo = {
  key: string;
  type: string;
  title?: string;
  description?: string;
};

function brandToString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const toS = (x: unknown) =>
    typeof x === "symbol" ? (x.description ?? String(x)) : String(x);
  return Array.isArray(v) ? v.map(toS).join(" & ") : toS(v);
}

function getBrandName(ast: AST.AST): string | undefined {
  return brandToString(ast.annotations?.[AST.BrandAnnotationId as any]);
}

function getIdentifier(ast: AST.AST): string | undefined {
  const id = ast.annotations?.[AST.IdentifierAnnotationId as any];
  return typeof id === "string" ? id : undefined;
}

function getAnnotation<T>(
  node: { annotations?: Record<PropertyKey, unknown> } | undefined,
  key: symbol,
): T | undefined {
  return node?.annotations?.[key as any] as T | undefined;
}

function getBaseType(ast: AST.AST): string {
  // Check brand on the current node first (brands may sit on TypeLiteral, etc.)
  const brand = getBrandName(ast);
  if (brand) return `custom<${brand}>`;

  switch (ast._tag) {
    case "Refinement":
    case "Transformation":
      return getBaseType(ast.from);

    case "StringKeyword":
      return "string";
    case "BooleanKeyword":
      return "boolean";
    case "NumberKeyword":
      return "number";

    case "TypeLiteral": {
      const id = getIdentifier(ast);
      if (id) return `custom<${id}>`;
      return "object";
    }

    case "Declaration": {
      const id = getIdentifier(ast);
      return id ? `custom<${id}>` : "custom";
    }

    default:
      return "custom";
  }
}

export function structFields(schema: Schema.Schema<any, any>): FieldInfo[] {
  const ast = (schema as any).ast as AST.AST;
  if (ast._tag !== "TypeLiteral") {
    throw new Error("Expected a Struct (TypeLiteral) schema");
  }

  return ast.propertySignatures.map((prop) => {
    const key =
      typeof prop.name === "symbol"
        ? (prop.name.description ?? String(prop.name))
        : prop.name.toString();

    // Prefer property-level annotations, then fall back to the type node
    const title =
      getAnnotation<string>(prop, AST.TitleAnnotationId) ??
      getAnnotation<string>(prop.type, AST.TitleAnnotationId);

    const description =
      getAnnotation<string>(prop, AST.DescriptionAnnotationId) ??
      getAnnotation<string>(prop.type, AST.DescriptionAnnotationId);

    const type = getBaseType(prop.type);

    return { key, type, title, description };
  });
}
