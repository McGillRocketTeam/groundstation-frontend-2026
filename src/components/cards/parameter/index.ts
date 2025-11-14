import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { ParameterCard } from "./parameter-card";

const ParameterCardConfiguration = Schema.TaggedStruct("ParameterCard", {
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Parmeter Card" });

type test = typeof ParameterCardConfiguration.Type;

export { ParameterCard, ParameterCardConfiguration };
