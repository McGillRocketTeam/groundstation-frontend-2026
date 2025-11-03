import { linksSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Suspense } from "react";
import { ParameterCardConfiguration } from ".";

export function ParameterCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof ParameterCardConfiguration.Type>,
) {
  return (
    <Suspense fallback={<div>Loading Param...</div>}>
      <Test />
    </Suspense>
  );
}

function Test() {
  const links = useAtomSuspense(linksSubscriptionAtom).value;
  return (
    <div className="h-full w-full overflow-scroll p-2">
      {links.map((link) => (
        <div key={link.name}>{link.name}</div>
      ))}
    </div>
  );
}
