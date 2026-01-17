import type { IDockviewPanelProps } from "dockview-react";
import { GaugecardConfiguration } from ".";
import {Gauge} from "@/components/cards/gauge-card/gauge.tsx";
import {Suspense} from "react";

export function GaugeCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {params}: IDockviewPanelProps<typeof GaugecardConfiguration.Type>,
) {

  return (
    <div className="h-full w-full overflow-scroll p-2">
        <Suspense fallback={<div>Loading...</div>}>
            <Gauge minNumber={params.minValue} maxNumber={params.maxValue} />
        </Suspense>
    </div>
  );
}
