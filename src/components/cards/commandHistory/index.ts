import { Schema } from "effect";
import { CommandHistoryCard } from "./command-history-card";

const CommandHistoryCardConfiguration = Schema.TaggedStruct(
  "CommandHistoryCard",
  {},
).annotations({ title: "Command History Card" });

export { CommandHistoryCard, CommandHistoryCardConfiguration };
