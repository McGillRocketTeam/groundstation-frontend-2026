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

import { DashboardTab } from "@/components/app/dashboard-tab";
import "./dashboard.css";

export function DashboardPage() {
  const setDockviewApi = useAtomSet(dockviewApiAtom);
  const [panelCount, setPanelCount] = useState(0);

  function onReady(event: DockviewReadyEvent) {
    const api = event.api;
    // We store the reference to dockview api so we can use it later
    setDockviewApi(Option.some(api));

    setPanelCount(api.totalPanels);
    api.onDidAddPanel(() => setPanelCount(api.totalPanels));
    api.onDidRemovePanel(() => setPanelCount(api.totalPanels));

    api.addPanel({
      id: crypto.randomUUID(),
      component: "TextCard",
      params: {
        text: "Card1",
        boolean: false,
      },
    });
    api.addPanel({
      id: crypto.randomUUID(),
      component: "TextCard",
      params: {
        text: "Card2",
        boolean: false,
      },
    });
  }

  return (
    <div className="relative h-[calc(100%-10px)] w-full">
      <DockviewReact
        theme={themeAbyssSpaced}
        onReady={onReady}
        components={cardComponentMap}
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
