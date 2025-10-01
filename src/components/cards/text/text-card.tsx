import {
  Combobox,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { YamcsClient } from "@/lib/yamcs/client";
import type { ParameterInfo } from "@/lib/yamcs/client/types";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Cause } from "effect";
import { useState } from "react";
import { TextCardConfiguration } from ".";

type ParameterInfo = typeof ParameterInfo.Type;

export function TextCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  const result = useAtomValue(
    YamcsClient.query("mdb", "listParameters", {
      urlParams: {},
      path: {
        instance: "mqtt-frames",
      },
    }),
  );

  const [value, setValue] = useState<ParameterInfo | undefined>();

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {/* <div className="bg-neutral-background text-neutral border px-2"> */}
      {Result.match(result, {
        onInitial: () => <div>Loading...</div>,
        onFailure: (fail) => <div>{Cause.pretty(fail.cause)}</div>,
        onSuccess: (data) => (
          <div className="flex w-full flex-col">
            <Combobox
              value={value}
              onValueChange={(v) => setValue(v)}
              items={data.value.parameters as ParameterInfo[]}
              itemToStringLabel={(item) => item.name}
            >
              <ComboboxTrigger>
                {!value && (
                  <span className="text-muted-foreground">
                    Nothing Selected
                  </span>
                )}
                <ComboboxValue />
                <ComboboxIcon />
              </ComboboxTrigger>
              <ComboboxPortal>
                <ComboboxPositioner>
                  <ComboboxPopup>
                    <div className="h-[var(--input-container-height)] p-2 text-center">
                      <ComboboxInput placeholder="Search Parameters..." />
                    </div>
                    <ComboboxEmpty>No Parameters Found.</ComboboxEmpty>
                    <ComboboxList>
                      {(parameter: ParameterInfo) => (
                        <ComboboxItem
                          key={parameter.qualifiedName}
                          value={parameter}
                        >
                          <ComboboxItemIndicator />
                          <div className="col-start-2">
                            {parameter.qualifiedName}
                          </div>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </ComboboxPositioner>
              </ComboboxPortal>
            </Combobox>
          </div>
        ),
      })}
      {/* </div> */}
    </div>
  );
}
