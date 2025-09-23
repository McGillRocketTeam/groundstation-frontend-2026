import type { IDockviewPanelProps } from "dockview-react";
import { TextCard2Configuration } from ".";

export function TextCard2(
  props: IDockviewPanelProps<typeof TextCard2Configuration.Type>,
) {
  return <div>{props.params.text} 2222</div>;
}
