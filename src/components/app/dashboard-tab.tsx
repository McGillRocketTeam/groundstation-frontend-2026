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
import React, { useState } from "react";
import { AddCardDialog, type AddCardDialogProps } from "./add-card-dialog";

export function DashboardTab(
  props: IDockviewPanelHeaderProps<CardConfigurationUnion>,
) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const updateCard: NonNullable<AddCardDialogProps["onSubmit"]> = (card) => {
    const currentPanel = props.containerApi.getPanel(props.api.id);
    if (!currentPanel) {
      console.warn("Unable to delete panel, could not find id.");
      return;
    }

    // The cleanest way to update the panel is to
    // remove the old one and replace it.
    //
    // This is because we can't change the underlying component type
    // easily so we can just remake the whole thing.
    props.containerApi.removePanel(currentPanel);
    props.containerApi.addPanel({
      id: crypto.randomUUID(),
      ...card,
    });
  };

  return (
    <React.Fragment>
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
          <ContextMenuItem onClick={() => setShowEditDialog(true)}>
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
            Delete
            <ContextMenuShortcut>
              <TrashIcon />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* This dialog is shown as the edit menu */}
      <AddCardDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        defaultValues={{
          schema: props.params._tag,
          title: props.api.title,
          params: props.params,
        }}
        onSubmit={updateCard}
      />
    </React.Fragment>
  );
}
