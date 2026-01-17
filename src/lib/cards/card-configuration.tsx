import { TextCard, TextCardConfiguration } from "@/components/cards/text";
import { GaugeCard, GaugecardConfiguration } from "@/components/cards/gauge-card";
// Match cards with their schemas
export const cardSchemaMap = {
  TextCard: TextCardConfiguration,
  GaugeCard: GaugecardConfiguration,// <-- Effect schema
};
type CardSchemaMap = typeof cardSchemaMap;
type CardSchemaValues = CardSchemaMap[keyof CardSchemaMap];

// Helper for passing around to different UI elements
export type CardConfigurationUnion = CardSchemaValues["Type"];

// Match cards with their React components
export const cardComponentMap = {
  TextCard: TextCard,
  GaugeCard: GaugeCard,
};
