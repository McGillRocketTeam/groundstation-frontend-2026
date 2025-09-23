import type { IDockviewPanelProps } from "dockview-react";
import { ButtonCardConfiguration } from ".";

export function ButtonCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof ButtonCardConfiguration.Type>,
) {
  return <div className="h-full w-full">Hello World</div>;
}
