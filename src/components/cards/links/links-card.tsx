import { YamcsClient } from "@/lib/yamcs/client";
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { LinksCardConfiguration } from ".";

export function LinksCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof LinksCardConfiguration.Type>,
) {
  const result = useAtomValue(
    YamcsClient.query("link", "listLinks", {
      path: {
        instance: "mqtt-frames",
      },
      reactivityKeys: ["yamcs-links"],
    }),
  );

  const disable = useAtomSet(YamcsClient.mutation("link", "disableLink"));
  const enable = useAtomSet(YamcsClient.mutation("link", "enableLink"));

  return <div className="h-full w-full overflow-scroll p-2">Links Card</div>;
}
