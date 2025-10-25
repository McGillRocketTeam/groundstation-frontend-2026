import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { MapCard } from "./map-card";

const MapCardConfiguration = Schema.TaggedStruct("MapCard", {
  lat: Schema.NumberFromString.pipe(
    Schema.greaterThan(-90),
    Schema.lessThan(90),
    Schema.annotations({ title: "Latitude" }),
  ),
  long: Schema.Number.pipe(
    Schema.greaterThan(-180),
    Schema.lessThan(180),
    // Schema.annotations({ title: "Longitude" }),
  ),
  trackerLat: ParameterInfoType.annotations({ title: "Tracker Latitude" }),
  trackerLong: ParameterInfoType.annotations({ title: "Tracker Longitude" }),
}).annotations({ title: "Map Card" });

export { MapCard, MapCardConfiguration };
