import { AddCardDialog } from "@/components/app/add-card-dialog";
import { Button } from "@/components/ui/button";
import { dockviewApiAtom } from "@/lib/atoms/dockview";
import { cardComponentMap } from "@/lib/cards/card-configuration";
import { useAtomSet } from "@effect-atom/atom-react";
import {
  DockviewReact,
  themeAbyssSpaced,
  type DockviewReadyEvent,
} from "dockview-react";
import { Option } from "effect";
import { useState } from "react";

import { DashboardPlus } from "@/components/app/dashboard-plus";
import { DashboardTab } from "@/components/app/dashboard-tab";
import { useDashboard, type DashboardSlug } from "@/lib/atoms/dashboard";
import "./dashboard.css";

export function DashboardPage({ slug }: { slug: DashboardSlug }) {
  const setDockviewApi = useAtomSet(dockviewApiAtom);
  const [panelCount, setPanelCount] = useState(0);

  const [dashboard, setDashboard] = useDashboard(slug);

  if (dashboard === undefined) {
    throw new Error(`Dashboard "${slug}" was not found.`);
  }

  function onReady(event: DockviewReadyEvent) {
    if (dashboard === undefined) {
      throw new Error(`Dashboard "${slug}" was not found.`);
    }
    const api = event.api;
    // We store the reference to dockview api so we can use it later
    setDockviewApi(Option.some(api));

    setPanelCount(api.totalPanels);
    api.onDidAddPanel(() => setPanelCount(api.totalPanels));
    api.onDidRemovePanel(() => setPanelCount(api.totalPanels));

    api.fromJSON(dashboard.dockviewLayout);

    api.onDidLayoutChange(() => {
      const layout = api.toJSON();
      setDashboard({ ...dashboard, dockviewLayout: layout });
    });
  }

  return (
    <div className="relative h-[calc(100%-10px)] w-full">
      <DockviewReact
        theme={themeAbyssSpaced}
        onReady={onReady}
        components={cardComponentMap}
        leftHeaderActionsComponent={DashboardPlus}
        defaultTabComponent={DashboardTab}
      />

      {/* If there are no panels, show a special error */}
      {/* so the user is not stuck on an empty dashboard */}
      {panelCount === 0 && (
        <div className="crossed absolute inset-0 z-10 grid h-full w-full place-items-center">
          <AddCardDialog
            trigger={<Button variant="outline">ADD CARD </Button>}
          />
        </div>
      )}
    </div>
  );
}
