import { TextCard } from "@/cards/text/text-card";
import {
  DockviewApi,
  DockviewReact,
  type DockviewReadyEvent,
} from "dockview-react";
import { useState } from "react";

const components = {
  text: TextCard,
};

export function DashboardPage() {
  const [dockviewApi, setDockviewApi] = useState<DockviewApi | undefined>(
    undefined,
  );

  function onReady(event: DockviewReadyEvent) {
    // We store the reference to dockview api so we can use it later
    setDockviewApi(event.api);
  }

  return (
    <div className="relative h-full w-full">
      {/* If there are no panels, show a special error */}
      {/* so the user is not stuck on an empty dashboard */}
      {dockviewApi?.totalPanels === 0 && (
        <div className="crossed absolute inset-0 grid h-full w-full place-items-center">
          <div className="bg-background border p-2">EMPTY DASHBOARD</div>
        </div>
      )}
      <DockviewReact onReady={onReady} components={components} />
    </div>
  );
}
