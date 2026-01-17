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
    YamcsClient.query("link", "listLinks", {
      path: {
        instance: "mqtt-frames",
      },
      reactivityKeys: ["yamcs-links"],
    }),
  );

  const disable = useAtomSet(YamcsClient.mutation("link", "disableLink"));
  const enable = useAtomSet(YamcsClient.mutation("link", "enableLink"));

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {/* <div className="bg-neutral-background text-neutral border px-2"> */}
      {Result.match(result, {
        onInitial: () => <div>Loading....</div>,
        onFailure: (fail) => (
          <pre className="whitespace-pre-wrap">{Cause.pretty(fail.cause)}</pre>
        ),
        onSuccess: ({ value }) => (
          <div>
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => {
                  disable({
                    path: {
                      instance: "mqtt-frames",
                      link: "MQTT_FRAME_IN",
                    },
                    reactivityKeys: ["yamcs-links"],
                  });
                }}
              >
                Disable
              </Button>

              <Button
                onClick={() => {
                  enable({
                    path: {
                      instance: "mqtt-frames",
                      link: "MQTT_FRAME_IN",
                    },
                    reactivityKeys: ["yamcs-links"],
                  });
                }}
              >
                Enable
              </Button>
            </div>
            <pre className="flex w-full flex-col">
              {value.links.map((c) => (
                <div key={c.name}>
                  {c.parentName} {c.name} {c.status}
                </div>
              ))}
            </pre>
          </div>
        ),
      })}
      {/* </div> */}
    </div>
  );
}
