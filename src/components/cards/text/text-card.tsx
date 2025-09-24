import type { IDockviewPanelProps } from "dockview-react";
import { TextCardConfiguration } from ".";

export function TextCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  return (
    <div className="crossed grid h-full w-full place-items-center">
      <div className="bg-neutral-background text-neutral border px-2">
        Hello World
      </div>
    </div>
  );
}
