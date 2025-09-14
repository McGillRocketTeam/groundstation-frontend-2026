import type { IDockviewPanelProps } from "dockview-react";
import { TextCardConfiguration } from "./schema";

export function TextCard(
  props: IDockviewPanelProps<typeof TextCardConfiguration.Type>,
) {
  return <div>Hello World</div>;
}
