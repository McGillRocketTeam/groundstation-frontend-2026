import { timeSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Suspense } from "react";
import { TextCardConfiguration } from ".";

export function TextCard({
  params,
}: IDockviewPanelProps<typeof TextCardConfiguration.Type>) {
  return (
    <div className="h-full w-full overflow-scroll p-2">
      <Suspense fallback={<div>Loading Time...</div>}>
        <div>{params.text}</div>
        <Test />
      </Suspense>
    </div>
  );
}

function Test() {
  const { value: time } = useAtomSuspense(timeSubscriptionAtom).value;
  return <div>{time.toLocaleString()}</div>;
}
