import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addCardAtom } from "@/lib/atoms/dockview";
import { cardSchemaMap } from "@/lib/cards/card-configuration";
import { annotations } from "@/lib/utils/ui";
import { useAtomSet } from "@effect-atom/atom-react";
import type React from "react";
import { useState } from "react";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxTrigger,
  ComboboxValue,
} from "../ui/combobox";
import { Input } from "../ui/input";
import { AddCardForm } from "./add-card-form";

type TriggerType = NonNullable<
  React.ComponentProps<typeof DialogTrigger>["render"]
>;

const cardSchemas = Object.keys(cardSchemaMap);
type CardSchemaKey = keyof typeof cardSchemaMap;
type DefaultValues = {
  schema: string;
  title: string | undefined;
  params: Record<string, any>;
};

export type AddCardDialogProps = {
  defaultValues?: DefaultValues;
  onSubmit?: (card: {
    title: string;
    component: string;
    params: Record<string, any>;
  }) => void;
} & (
  | {
      trigger: TriggerType;
      open?: never;
      onOpenChange?: never;
    }
  | {
      trigger?: never;
      open: boolean;
      onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    }
);

const itemToString = (item: string) => {
  return item === "Select Card"
    ? "Select Card"
    : (annotations(cardSchemaMap[item as keyof typeof cardSchemaMap]).title ??
        item);
};

export function AddCardDialog({
  defaultValues,
  trigger,
  open,
  onOpenChange,
  onSubmit,
}: AddCardDialogProps) {
  const addCard = useAtomSet(addCardAtom);

  const [selectedSchemaKey, setSelectedSchemaKey] = useState<
    CardSchemaKey | "Select Card"
  >(
    defaultValues?.schema
      ? (defaultValues.schema as CardSchemaKey)
      : "Select Card",
  );

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [internalOpen, setInternalOpen] = useState(false);

  return (
    <Dialog
      open={open ? open : internalOpen}
      onOpenChange={(isOpen) => {
        if (onOpenChange) {
          onOpenChange(isOpen);
        } else {
          setInternalOpen(isOpen);
          // Reset the form every time it's opened
          // only if it's not controlled
          if (isOpen) {
            setSelectedSchemaKey("Select Card");
            setTitle("");
          }
        }
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="bg-neutral-background">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit Card" : "Add Card"}</DialogTitle>
          <DialogDescription className="sr-only">
            Configure your card for dashboard.
          </DialogDescription>
        </DialogHeader>

        <Combobox
          value={selectedSchemaKey}
          onValueChange={(value) =>
            setSelectedSchemaKey(value as CardSchemaKey)
          }
          items={cardSchemas}
          itemToStringLabel={itemToString}
          autoHighlight
        >
          <ComboboxTrigger>
            <ComboboxValue />
            <ComboboxIcon />
          </ComboboxTrigger>
          <ComboboxPortal>
            <ComboboxPositioner className="z-50">
              <ComboboxPopup>
                <ComboboxEmpty>No Parameters Found.</ComboboxEmpty>
                <ComboboxList>
                  {(schema) => (
                    <ComboboxItem key={schema} value={schema}>
                      <ComboboxItemIndicator />
                      <div className="col-start-2">{itemToString(schema)}</div>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxPopup>
            </ComboboxPositioner>
          </ComboboxPortal>
        </Combobox>

        <div className="flex flex-col gap-2">
          <label className="text-sm" htmlFor="card-title">
            Card Title
          </label>
          <Input
            id="card-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <hr />

        {selectedSchemaKey !== "Select Card" && (
          <AddCardForm
            schema={cardSchemaMap[selectedSchemaKey]}
            defaultParams={defaultValues?.params}
            onSubmit={({ _tag, ...values }) => {
              const params = {
                _tag,
                ...values,
              };

              if (onSubmit) {
                onSubmit({
                  component: _tag,
                  title,
                  params,
                });
              } else {
                addCard({
                  id: crypto.randomUUID(),
                  component: _tag,
                  title,
                  params,
                });
                setInternalOpen(false);
              }
            }}
          />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="add-card-form">
            {defaultValues ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
