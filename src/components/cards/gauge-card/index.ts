import { Schema } from "effect";
import { GaugeCard } from "./gauge-card";

const GaugecardConfiguration = Schema.TaggedStruct("GaugeCard", {
    minValue: Schema.NumberFromString,
    maxValue: Schema.NumberFromString,
    value: Schema.NumberFromString,
}).annotations({ title: "Gauge Card" });

export { GaugeCard, GaugecardConfiguration };
