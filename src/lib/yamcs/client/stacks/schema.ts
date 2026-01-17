import { Schema } from "effect";
import { QualifiedName } from "../types";

const DefaultUUID = Schema.optionalWith(Schema.UUID, {
  default: () => crypto.randomUUID(),
});

export const Advancement = Schema.Struct({
  acknowledgment: Schema.Literal(
    "Acknowledge_Queued",
    "Acknowledge_Released",
    "Acknowledge_Sent",
    "Acknowledge_Completed",
  ).annotations({
    default: "Acknowledge_Queued",
    description:
      "Acknowledgment which needs to succeed before the stack cursor advances on a command step",
  }),
  wait: Schema.NonNegativeInt.annotations({
    description:
      "Time to await (in milliseconds) before advancing to the next step. This triggers after the acknowledgment has succeeded.",
  }),
}).annotations({
  description: "Command advancement options",
});

export const TextStep = Schema.Struct({
  type: Schema.Literal("text"),
  key: DefaultUUID,
  comment: Schema.optional(Schema.String),
  text: Schema.String.annotations({ description: "Text in Markdown format" }),
});

export const CheckStep = Schema.Struct({
  type: Schema.Literal("check"),
  comment: Schema.optional(Schema.String),
  key: DefaultUUID,
  parameters: Schema.Array(
    Schema.Struct({
      key: DefaultUUID,
      parameter: QualifiedName.annotations({
        description: "Qualified parameter name",
      }),
    }),
  ).annotations({
    description: "Parameters to check",
  }),
});

export const Value = Schema.Union(
  Schema.Boolean,
  Schema.Number,
  Schema.Object,
  Schema.String,
);

export const CommandStep = Schema.Struct({
  type: Schema.Literal("command"),
  comment: Schema.optional(Schema.String),
  key: DefaultUUID,
  name: QualifiedName.annotations({
    description:
      "Name of the command. Unless namespace is specified, this should be the fully-qualified name",
  }),
  namespace: Schema.optional(Schema.String).annotations({
    description:
      "Namespace applicable to the used command name. Not required if the name is the fully-qualified Yamcs name",
  }),
  arguments: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Value,
      }),
    ),
  ).annotations({
    description: "Command arguments",
  }),
  advancement: Schema.optional(Advancement),
});

export class Operator extends Schema.Class<Operator>("Operator")({
  raw: Schema.Literal("eq", "neq", "le", "lte", "gt", "gte"),
}) {
  toString() {
    switch (this.raw) {
      case "eq":
        return "=";
      case "neq":
        return "!=";
      case "le":
        return "<";
      case "lte":
        return "<=";
      case "gt":
        return ">";
      case "gte":
        return ">=";
      default:
        return this.raw;
    }
  }
}

const OperatorFromString = Schema.transform(
  Schema.Literal("eq", "neq", "le", "lte", "gt", "gte"),
  Operator,
  {
    strict: true,
    decode(literal) {
      return Operator.make({ raw: literal });
    },
    encode(operator) {
      return operator.raw;
    },
  },
);

export const Condition = Schema.Struct({
  parameter: QualifiedName.annotations({
    description: "Qualified parameter name",
  }),
  operator: OperatorFromString.annotations({
    description: "Comparison operator",
  }),
  value: Value.annotations({
    description: "Value to compare against",
  }),
  key: DefaultUUID,
});

export const VerifyStep = Schema.Struct({
  type: Schema.Literal("verify"),
  comment: Schema.optional(Schema.String),
  key: DefaultUUID,
  condition: Schema.Array(Condition).annotations({
    description: "Comparisons to verify (all must be satisfied)",
  }),
  delay: Schema.optional(Schema.Int).annotations({
    description: "Wait time before starting to check (in milliseconds)",
    default: 0,
  }),
  timeout: Schema.optional(Schema.Int).annotations({
    description:
      "How long before the verification is considered unsuccessful (in milliseconds)",
  }),
});

export const Step = Schema.Union(TextStep, CheckStep, CommandStep, VerifyStep);

export const YCSStack = Schema.Struct({
  steps: Schema.Array(Step),
  advancement: Advancement,
}).annotations({
  description: "JSON schema for Yamcs Stack files (*.ycs)",
});

export type YCSStack = typeof YCSStack.Type;

export const RunnableYCSStack = Schema.Struct({
  steps: Schema.Array(
    Schema.extend(
      Step,
      Schema.Struct({
        state: Schema.optionalWith(
          Schema.Literal("pending", "running", "success", "error"),
          { default: () => "pending" },
        ),
      }),
    ),
  ),
  advancement: Advancement,
}).annotations({
  description: "JSON schema for Yamcs Stack files (*.ycs)",
});
