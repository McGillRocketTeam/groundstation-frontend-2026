import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { ParameterCard } from "./parameter-card";

const ParameterCardConfiguration = Schema.TaggedStruct("ParameterCard", {
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Parmeter Card" });

export { ParameterCard, ParameterCardConfiguration };
