import { AddCardDialog } from "@/components/app/add-card-dialog";
import { TextCard } from "@/components/cards/text";
import { Button } from "@/components/ui/button";
import { dockviewApiAtom } from "@/lib/atoms/dockview";
import { cardComponentMap } from "@/lib/cards/card-configuration";
import { useAtomSet } from "@effect-atom/atom-react";
import {
  DockviewReact,
  themeLight,
  type DockviewReadyEvent,
} from "dockview-react";
import "dockview/dist/styles/dockview.css";
import { Option } from "effect";
import { useState, type FunctionComponent } from "react";

const components = {
  TextCard: TextCard,
};

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
  }

  return (
    <div className="relative h-full w-full">
      <DockviewReact
        theme={themeLight}
        onReady={onReady}
        components={cardComponentMap as Record<string, FunctionComponent>}
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
