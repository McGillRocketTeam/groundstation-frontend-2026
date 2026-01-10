import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { ParameterTableCard } from "./parameter-table-card";

const ParameterTableCardConfiguration = Schema.TaggedStruct("ParameterTableCard", {
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "ParmeterTableCard Card" });

export { ParameterTableCard, ParameterTableCardConfiguration };