import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { CardConfigurationUnion } from "@/lib/cards/card-configuration";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import type { IDockviewPanelHeaderProps } from "dockview-react";

export function DashboardTab(
  props: IDockviewPanelHeaderProps<CardConfigurationUnion>,
) {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={(cmp) => (
          <div
            {...cmp}
            className="flex h-full flex-row items-center gap-2 px-2"
          >
            <span>{props.api.title}</span>
          </div>
        )}
      />
      <ContextMenuContent>
        <ContextMenuItem>
          Edit
          <ContextMenuShortcut>
            <Pencil1Icon />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const panel = props.containerApi.getPanel(props.api.id);
            if (panel) props.containerApi.removePanel(panel);
          }}
          variant="destructive"
        >
          Delete{" "}
          <ContextMenuShortcut>
            <TrashIcon />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
