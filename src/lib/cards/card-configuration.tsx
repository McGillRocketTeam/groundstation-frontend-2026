import {
  CommandHistoryCard,
  CommandHistoryCardConfiguration,
} from "@/components/cards/commandHistory";
import {
  MqttDebugCard,
  MqttDebugCardConfiguration,
} from "@/components/cards/debug";
import {
  ParameterCard,
  ParameterCardConfiguration,
} from "@/components/cards/parameter";
import { TextCard, TextCardConfiguration } from "@/components/cards/text";

// Match cards with their schemas
export const cardSchemaMap = {
  TextCard: TextCardConfiguration, // <-- Effect schema
  MqttDebugCard: MqttDebugCardConfiguration,
  ParameterCard: ParameterCardConfiguration,
  CommandHistoryCard: CommandHistoryCardConfiguration,
};
type CardSchemaMap = typeof cardSchemaMap;
type CardSchemaValues = CardSchemaMap[keyof CardSchemaMap];

// Helper for passing around to different UI elements
export type CardConfigurationUnion = CardSchemaValues["Type"];

// Match cards with their React components
export const cardComponentMap = {
  TextCard: TextCard,
  MqttDebugCard: MqttDebugCard,
  ParameterCard: ParameterCard,
  CommandHistoryCard: CommandHistoryCard,
};
