import { YamcsClient } from "@/lib/yamcs/client";
import type { CommandHistoryAttribute } from "@/lib/yamcs/client/types";
import { useAtomSuspense } from "@effect-atom/atom-react";
import { Suspense } from "react";

export function CommandHistoryCard() {
  return (
    <div className="h-full overflow-scroll rounded-xl bg-black p-2 text-white">
      <h2 className="mb-2 text-lg font-bold">CMD History</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <CommandTable />
      </Suspense>
    </div>
  );
}

function CommandTable() {
  const { commands } = useAtomSuspense(
    YamcsClient.query("command", "listCommands", {
      path: { instance: "mqtt-frames" },
    }),
  ).value;

  console.log("Commands:", commands);

  // Extract success status from command attributes
  function getStatus(attrs: readonly (typeof CommandHistoryAttribute.Type)[]) {
    const released = attrs.find(
      (a) => a.name === "Acknowledge_Released_Status",
    );

    if (!released) return "NOK";

    // Some Yamcs responses store value as {stringValue: "OK"} or similar
    const val = released.value.type === "STRING" ? released.value.value : "NOK";

    return val;
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th>Time</th>
          <th>Name</th>
          <th>Success</th>
        </tr>
      </thead>
      <tbody>
        {commands.map((cmd) => {
          return (
            <tr key={cmd.id}>
              <td>{new Date(cmd.generationTime).toLocaleTimeString()}</td>
              <td>{cmd.commandId.commandName}</td>
              <td>{getStatus(cmd.attr) === "OK" ? "✅" : "❌"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
