import {
  CommandHistoryCard,
  CommandHistoryCardConfiguration,
} from "@/components/cards/commandHistory";
import {
  MqttDebugCard,
  MqttDebugCardConfiguration,
} from "@/components/cards/debug";
import { LinksCard, LinksCardConfiguration } from "@/components/cards/links";
import {
  ParameterCard,
  ParameterCardConfiguration,
} from "@/components/cards/parameter";

import { TextCard, TextCardConfiguration } from "@/components/cards/text";

// Match cards with their schemas
export const cardSchemaMap = {
  LinksCard: LinksCardConfiguration, // <-- Effect schema
  TextCard: TextCardConfiguration, // <-- Effect schema
  ParameterCard: ParameterCardConfiguration,
  CommandHistoryCard: CommandHistoryCardConfiguration,

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
  ParameterCard: ParameterCard,
  CommandHistoryCard: CommandHistoryCard,
  MqttDebugCard: MqttDebugCard,
};
