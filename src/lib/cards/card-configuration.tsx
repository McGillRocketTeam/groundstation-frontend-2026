import {
  MqttDebugCard,
  MqttDebugCardConfiguration,
} from "@/components/cards/debug";
import { LinksCard, LinksCardConfiguration } from "@/components/cards/links";
import { TextCard, TextCardConfiguration } from "@/components/cards/text";

// Match cards with their schemas
export const cardSchemaMap = {
  TextCard: TextCardConfiguration,
  LinksCard: LinksCardConfiguration, // <-- Effect schema
  MqttDebugCard: MqttDebugCardConfiguration,
};
type CardSchemaMap = typeof cardSchemaMap;
type CardSchemaValues = CardSchemaMap[keyof CardSchemaMap];

// Helper for passing around to different UI elements
export type CardConfigurationUnion = CardSchemaValues["Type"];

// Match cards with their React components
export const cardComponentMap = {
  TextCard: TextCard,
  LinksCard: LinksCard,
  MqttDebugCard: MqttDebugCard,
};
