import { Schema } from "effect";
import { MqttDebugCard } from "./mqtt-debug-card";

const MqttDebugCardConfiguration = Schema.TaggedStruct("MqttDebugCard", {
  brokerUrl: Schema.URL.annotations({ title: "Broker URL" }),
}).annotations({ title: "Mqtt Debug Card" });

export { MqttDebugCard, MqttDebugCardConfiguration };
