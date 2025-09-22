import { YamcsWebsocketSubscription } from "@/lib/yamcs/client/websocket/websocket";
import { Atom, useAtomValue } from "@effect-atom/atom-react";
import { Effect, Layer, Logger } from "effect";
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

const atomRuntime = Atom.runtime(
  Layer.mergeAll(YamcsWebsocketSubscription.Default, Logger.pretty),
);

const websocketAtom = atomRuntime.atom(
  Effect.gen(function* () {
    const websocket = yield* YamcsWebsocketSubscription;
    return yield* websocket.setup;
  }),
);

// eslint-disable-next-line react-refresh/only-export-components
function WebsocketTesting() {
  useAtomValue(websocketAtom);
  return <div>Hello World</div>;
}
