import { Schema } from "effect";
import { LinksCard } from "./links-card";

const LinksCardConfiguration = Schema.TaggedStruct("LinksCard", {
}).annotations({ title: "Links Card" });

export { LinksCard, LinksCardConfiguration };
