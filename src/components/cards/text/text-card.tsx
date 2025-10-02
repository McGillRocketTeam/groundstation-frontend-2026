import { Button } from "@/components/ui/button";
import { YamcsClient } from "@/lib/yamcs/client";
import { Result, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Cause } from "effect";
import { TextCardConfiguration } from ".";

export function TextCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  const result = useAtomValue(
    YamcsClient.query("command", "listCommands", {
      path: {
        instance: "mqtt-frames",
      },
      reactivityKeys: ["yamcs-commands"],
    }),
  );

  const send = useAtomSet(YamcsClient.mutation("command", "issueCommand"));

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {/* <div className="bg-neutral-background text-neutral border px-2"> */}
      {Result.match(result, {
        onInitial: () => <div>Loading...</div>,
        onFailure: (fail) => (
          <pre className="whitespace-pre-wrap">{Cause.pretty(fail.cause)}</pre>
        ),
        onSuccess: ({ value }) => (
          <div>
            <Button
              onClick={() => {
                send({
                  path: {
                    instance: "mqtt-frames",
                    processor: "realtime",
                    name: "myproject/SwitchVoltageOff",
                  },
                  payload: { args: { Battery: "1" }, comment: "Hello World" },
                  reactivityKeys: ["yamcs-commands"],
                });
              }}
            >
              Test
            </Button>
            <pre className="flex w-full flex-col">
              {value.commands.map((c) => (
                <div key={c.id}>{c.commandId.commandName}</div>
              ))}
            </pre>
          </div>
        ),
      })}
      {/* </div> */}
    </div>
  );
}
