import { DashboardListSchema } from "@/lib/atoms/dashboard";
import { KeyValueStore } from "@effect/platform";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Effect, Layer, Logger, Option, Schema } from "effect";
import { createBrowserRouter } from "react-router";
import { SharedLayout } from "./layout/shared-layout";
import { DashboardPage } from "./pages/dashboard";
import { RootErrorBoundary } from "./pages/error";
import { SettingsPage } from "./pages/settings";

import defaultLayout from "@/../public/default-layout.json";
import { StackPage } from "./pages/stack";

export const getDashboardList = Effect.gen(function* () {
  const kv = yield* KeyValueStore.KeyValueStore;

  const maybeValue = yield* kv.get("mrt-gs-dashboards");

  const value = yield* Option.match(maybeValue, {
    onNone: () =>
      // Fall back to the baked-in JSON
      Schema.decodeUnknown(DashboardListSchema)(defaultLayout).pipe(
        Effect.tapErrorTag("ParseError", (e) =>
          Effect.logError("Unable to decode default dashboards ", e),
        ),
      ),
    onSome: (raw) =>
      Schema.decodeUnknown(Schema.parseJson(DashboardListSchema))(raw).pipe(
        Effect.tapErrorTag("ParseError", (e) =>
          Effect.logError("Unable to decode dashboards from local storage", e),
        ),
      ),
  });

  return value;
}).pipe(
  Effect.provide(
    Layer.merge(BrowserKeyValueStore.layerLocalStorage, Logger.pretty),
  ),
);

export const router = createBrowserRouter([
  {
    element: <SharedLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      ...Effect.runSync(getDashboardList).map((dashboard) => ({
        path: dashboard.slug,
        errorElement: <RootErrorBoundary />,
        element: <DashboardPage slug={dashboard.slug} />,
      })),
      {
        path: "/stack",
        element: <StackPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
