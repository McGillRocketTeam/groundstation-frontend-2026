import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { MapCard } from "./map-card";

const MapCardConfiguration = Schema.TaggedStruct("MapCard", {
  text: Schema.String.pipe(
    Schema.minLength(5),
    Schema.annotations({
      title: "Body Text",
    }),
  ),
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Map Card" });

export { MapCard, MapCardConfiguration };
