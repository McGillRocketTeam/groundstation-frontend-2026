import type { QualifiedName } from "@/lib/yamcs/client/types";
import { parameterSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Suspense } from "react";
import { ParameterCardConfiguration } from ".";

export function ParameterCard({
  params,
}: IDockviewPanelProps<typeof ParameterCardConfiguration.Type>) {
  // We use `Suspense` here which is a feature built into react
  // because the subscription will need to wait for the first update
  // it will be suspending until it has a value
  // Therefore we must provide a fallback.
  //
  // In the child component (ParameterValue), we can act like the value
  // will alaways exist because react will handle the suspense for us,
  // when the value doesn't exist.
  return (
    <Suspense fallback={<div>Loading Param...</div>}>
      <ParameterValue param={params.parameter.qualifiedName} />
    </Suspense>
  );
}

function ParameterValue({ param }: { param: QualifiedName }) {
  const value = useAtomSuspense(parameterSubscriptionAtom(param)).value;
  return (
    <div className="h-full w-full overflow-scroll p-2">
      <div>{JSON.stringify(value.engValue)}</div>
    </div>
  );
}
