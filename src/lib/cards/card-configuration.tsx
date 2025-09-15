/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { TextCard, TextCardConfiguration } from "@/components/cards/text";
import type { IDockviewPanelProps } from "dockview-react";
import { Schema } from "effect";
import type { ComponentType } from "react";

export const CardConfiguration = Schema.Struct({});

type CardType = keyof typeof cardSchemaMap;
type SchemaOutput<S> = S extends Schema.Schema<any, infer A, any> ? A : never;
type CardComponentMap = {
  [K in CardType]: ComponentType<
    IDockviewPanelProps<SchemaOutput<(typeof cardSchemaMap)[K]>>
  >;
};

// Match cards with their schemas
export const cardSchemaMap = {
  text: TextCardConfiguration,
};

// Match cards with their React components
export const cardComponentMap: CardComponentMap = {
  text: TextCard,
};
