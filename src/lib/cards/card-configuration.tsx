import {
  MqttDebugCard,
  MqttDebugCardConfiguration,
} from "@/components/cards/debug";
import {
  EventsCard,
  EventsCardConfiguration
} from "@/components/cards/events";
import { TextCard, TextCardConfiguration } from "@/components/cards/text";

// Match cards with their schemas
export const cardSchemaMap = {
  TextCard: TextCardConfiguration, // <-- Effect schema
  MqttDebugCard: MqttDebugCardConfiguration,
  EventsCard: EventsCardConfiguration
};
type CardSchemaMap = typeof cardSchemaMap;
type CardSchemaValues = CardSchemaMap[keyof CardSchemaMap];

// Helper for passing around to different UI elements
export type CardConfigurationUnion = CardSchemaValues["Type"];

// Match cards with their React components
export const cardComponentMap = {
  TextCard: TextCard,
  MqttDebugCard: MqttDebugCard,
  EventsCard: EventsCard
};
