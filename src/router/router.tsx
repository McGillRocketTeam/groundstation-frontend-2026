import { YamcsWebsocketSubscription } from "@/lib/yamcs/client/websocket/websocket";
import { Effect, Fiber, Logger, ManagedRuntime } from "effect";
import { useEffect } from "react";
import { createBrowserRouter } from "react-router";
import { SharedLayout } from "./layout/shared-layout";
import { DashboardPage } from "./pages/dashboard";
import { RootErrorBoundary } from "./pages/error";
import { SettingsPage } from "./pages/settings";

export const router = createBrowserRouter([
  {
    element: <SharedLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "/",
        errorElement: <RootErrorBoundary />,
        element: <DashboardPage />,
      },
      {
        path: "/websocket",
        element: <WebsocketTesting />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const MyRuntime = ManagedRuntime.make(YamcsWebsocketSubscription.Default);

// eslint-disable-next-line react-refresh/only-export-components
function WebsocketTesting() {
  useEffect(() => {
    const fiber = MyRuntime.runFork(
      YamcsWebsocketSubscription.setup.pipe(
        Effect.provide(Logger.pretty),
        Effect.catchAll((e) => Effect.logError(e)),
      ),
    );

    return () => {
      MyRuntime.runCallback(Fiber.interrupt(fiber));
    };
  });
  return <div>Hello World</div>;
}
