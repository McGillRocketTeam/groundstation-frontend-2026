import { Schema } from "effect";
import { EventsCard } from "./events-card";

const EventsCardConfiguration = Schema.TaggedStruct("EventsCard", {}).annotations(
    { title: "Events Card" });

export { EventsCard, EventsCardConfiguration };