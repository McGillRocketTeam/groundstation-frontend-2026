import { Atom, useAtom } from "@effect-atom/atom-react";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Schema } from "effect";

import defaultLayout from "@/../public/default-layout.json";

export const DashboardSlug = Schema.String.pipe(Schema.brand("DashboardSlug"));
export type DashboardSlug = typeof DashboardSlug.Type;

const DashboardSchema = Schema.Struct({
  slug: DashboardSlug,
  title: Schema.String,
  dockviewLayout: Schema.Any,
});

export const DashboardListSchema = DashboardSchema.pipe(Schema.Array);

export const dashboardListAtom = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "mrt-gs-dashboards",
  schema: DashboardListSchema,
  defaultValue: () =>
    Schema.decodeUnknownSync(DashboardListSchema)(defaultLayout),
});

export function useDashboard(slug: DashboardSlug) {
  const [dashboardList, setDashboardList] = useAtom(dashboardListAtom);

  const dashboard = dashboardList.find((dashboard) => dashboard.slug === slug);

  const setDashboardFn = (newDashboard: typeof DashboardSchema.Type) => {
    setDashboardList((prior) =>
      prior.map((oldDashboard) =>
        oldDashboard.slug === slug ? newDashboard : oldDashboard,
      ),
    );
  };

  return [dashboard, setDashboardFn] as const;
}
