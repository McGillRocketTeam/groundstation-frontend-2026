import { ParameterInfoType } from "@/lib/cards/types";
import { Schema } from "effect";
import { TextCard } from "./text-card";
import { MqttDebugCard } from "./mqtt-debug-card";

const TextCardConfiguration = Schema.TaggedStruct("TextCard", {
  text: Schema.String.pipe(
    Schema.minLength(5),
    Schema.annotations({
      title: "Body Text",
    }),
  ),
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Text Card" });

const MqttDebugCardConfiguration = Schema.TaggedStruct("MqttDebugCard", {
  text: Schema.String.pipe(
    Schema.minLength(5),
    Schema.annotations({
      title: "Body Text",
    }),
  ),
  parameter: ParameterInfoType.annotations({ title: "YAMCS Parameter" }),
}).annotations({ title: "Mqtt Debug Card" });

export { TextCard, TextCardConfiguration, MqttDebugCard, MqttDebugCardConfiguration };
