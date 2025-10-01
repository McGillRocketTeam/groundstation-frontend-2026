import { Schema } from "effect";
import { ParameterInfo } from "../yamcs/client/types";

export const ParameterInfoType = ParameterInfo.pipe(
  Schema.brand("YAMCSParameterInfo"),
);

export type ParameterInfoType = typeof ParameterInfoType.Type;
