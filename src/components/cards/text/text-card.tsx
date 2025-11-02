import { websocketAtom } from "@/lib/yamcs/client/websocket2/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Suspense } from "react";
import { TextCardConfiguration } from ".";

export function TextCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  const time = useAtomSuspense(websocketAtom("time")).value;
  const links = useAtomSuspense(websocketAtom("links")).value;
  return (
    <div className="h-full w-full overflow-scroll p-2">
      <Suspense>
        TIME
        {JSON.stringify(time.data)}
        <hr />
      </Suspense>
      <Suspense>
        TIME
        {JSON.stringify(links.data)}
        <hr />
      </Suspense>
    </div>
  );
}
