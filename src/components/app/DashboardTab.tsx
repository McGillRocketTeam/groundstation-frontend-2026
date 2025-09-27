import type { CardConfigurationUnion } from "@/lib/cards/card-configuration";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { IDockviewPanelHeaderProps } from "dockview-react";

export function DashboardTab(
  props: IDockviewPanelHeaderProps<CardConfigurationUnion>,
) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span>{props.api.title}</span>
      <button>
        <Cross2Icon />
      </button>
    </div>
  );
}
