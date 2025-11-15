import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { TextCard } from "./text-card";
import { CommandHistoryCard } from "./command-history-card";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String.pipe(
    Schema.minLength(5),
    Schema.annotations({
      title: "Body Text",
    }),
  ),
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Text Card" });

const CommandHistoryConfiguration = Schema.TaggedStruct("CommandHistoryCard", {
}).annotations({ title: "Command History" });

export { TextCard, TextCardConfiguration };
export { CommandHistoryCard, CommandHistoryConfiguration};
