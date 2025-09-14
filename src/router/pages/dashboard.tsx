import { TextCard } from "@/components/cards/text";
import { Button } from "@/components/ui/button";
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
          <div>
            <Button variant="outline">ADD CARD</Button>
          </div>
        </div>
      )}

      <DockviewReact onReady={onReady} components={components} />
    </div>
  );
}
