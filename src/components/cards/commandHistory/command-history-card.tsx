import { YamcsClient } from "@/lib/yamcs/client";
import { commandsSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Chunk } from "effect";
import { Suspense } from "react";
import { CommandHistoryCardConfiguration } from ".";

export function CommandHistoryCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof CommandHistoryCardConfiguration.Type>,
) {
  return (
    <div className="h-full w-full overflow-scroll p-2">
      <Suspense fallback={<div>Awaitng History...</div>}>
        <Test2 />
      </Suspense>
      <hr />
      <Suspense fallback={<div>Awaitng Commands...</div>}>
        <Test />
      </Suspense>
    </div>
  );
}

function Test2() {
  const { commands } = useAtomSuspense(
    YamcsClient.query("command", "listCommands", {
      path: { instance: "mqtt-frames" },
    }),
  ).value;

  return (
    <div>
      {commands.map((cmd) => (
        <div key={cmd.id}>{cmd.commandName}</div>
      ))}
    </div>
  );
}

function Test() {
  const cmds = useAtomSuspense(commandsSubscriptionAtom).value;
  return (
    <div>
      {Chunk.toReadonlyArray(cmds).map((cmd) => (
        <div key={cmd.id}>{cmd.commandName}</div>
      ))}
    </div>
  );
}
