import { ButtonCard, ButtonCardConfiguration } from "@/components/cards/button";
import { TextCard, TextCardConfiguration } from "@/components/cards/text";
import { TextCard2, TextCard2Configuration } from "@/components/cards/text2";

// Match cards with their schemas
export const cardSchemaMap = {
  TextCard: TextCardConfiguration,
  TextCard2: TextCard2Configuration,
  ButtonCard: ButtonCardConfiguration,
};

// Match cards with their React components
export const cardComponentMap = {
  TextCard: TextCard,
  TextCard2: TextCard2,
  ButtonCard: ButtonCard,
};
