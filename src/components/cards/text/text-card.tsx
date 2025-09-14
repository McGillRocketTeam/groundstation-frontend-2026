import type { IDockviewPanelProps } from "dockview-react";
import { TextCardConfiguration } from ".";

export function TextCard(
  _props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  return <div>Hello World</div>;
}
