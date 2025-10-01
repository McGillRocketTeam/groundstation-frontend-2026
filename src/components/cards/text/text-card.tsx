import { YamcsClient } from "@/lib/yamcs/client";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Cause } from "effect";
import { TextCardConfiguration } from ".";

export function TextCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  const result = useAtomValue(
    YamcsClient.query("command", "getCommand", {
      path: {
        instance: "mqtt-frames",
        id: "1759332369290-0:0:0:0:0:0:0:1-0",
      },
    }),
  );

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {/* <div className="bg-neutral-background text-neutral border px-2"> */}
      {Result.match(result, {
        onInitial: () => <div>Loading...</div>,
        onFailure: (fail) => (
          <pre className="whitespace-pre-wrap">{Cause.pretty(fail.cause)}</pre>
        ),
        onSuccess: (data) => (
          <pre className="flex w-full flex-col">
            {JSON.stringify(data.value, null, 2)}
          </pre>
        ),
      })}
      {/* </div> */}
    </div>
  );
}
