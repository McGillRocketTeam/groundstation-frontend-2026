import { Atom } from "@effect-atom/atom-react";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Schema } from "effect";

import defaultLayout from "@/../public/default-layout.json";

export const dashboardAtom = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "mrt-gs-dashboards",
  schema: Schema.parseJson(),
  defaultValue: () => defaultLayout,
});
