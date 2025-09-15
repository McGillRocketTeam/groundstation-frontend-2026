/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { ButtonCardConfiguration } from "@/components/cards/button";
import { TextCardConfiguration } from "@/components/cards/text";
import { Schema } from "effect";

export const CardConfiguration = Schema.Struct({});

export const CardUnion = Schema.Union(
  TextCardConfiguration,
  ButtonCardConfiguration,
);
