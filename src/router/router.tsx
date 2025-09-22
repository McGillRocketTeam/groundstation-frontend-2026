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
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
