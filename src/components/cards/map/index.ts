import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { MapCard } from "./map-card";

const MapCardConfiguration = Schema.TaggedStruct("MapCard", {
  lat: Schema.Number.pipe(
    // Schema.greaterThan(-90),
    // Schema.lessThan(90),
    // Schema.annotations({ title: "Latitude" }),
  ),
  long: Schema.Number.pipe(
    // Schema.greaterThan(-180),
    // Schema.lessThan(180),
    // Schema.annotations({ title: "Longitude" }),
  ),
  tempTrackerLong: Schema.Number.pipe(
    // Schema.greaterThan(-180),
    // Schema.lessThan(180),
    // Schema.annotations({ title: "Marker Longitude" }),
  ),
  tempTrackerLat: Schema.Number.pipe(
    // Schema.greaterThan(-90),
    // Schema.lessThan(90),
    // Schema.annotations({ title: "Marker Latitude" }),
  ),
  // tracker latitude should use the YAMCS parameter selector (dropdown)
  trackerLat: Schema.optional(ParameterInfoType).annotations({ title: "Tracker Latitude" }),
  // tracker longitude remains optional (user may choose not to select it)
  trackerLong: Schema.optional(ParameterInfoType).annotations({ title: "Tracker Longitude" }),
}).annotations({ title: "Map Card" });

export { MapCard, MapCardConfiguration };
