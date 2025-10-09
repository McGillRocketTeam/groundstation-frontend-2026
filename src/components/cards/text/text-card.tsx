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
    YamcsClient.query("alarm", "listAlarms", {
      path: {
        instance: "mqtt-frames",
      },
    }),
  );

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {Result.match(result, {
        onInitial: () => <div>Loading...</div>,
        onFailure: (fail) => (
          <pre className="whitespace-pre-wrap">{Cause.pretty(fail.cause)}</pre>
        ),
        onSuccess: ({ value }) => <pre>{JSON.stringify(value, null, 2)}</pre>,
      })}
    </div>
  );
}
