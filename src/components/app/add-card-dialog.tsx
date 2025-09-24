import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
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
import { Input } from "../ui/input";
import { AddCardForm } from "./add-card-form";

type TriggerType = NonNullable<
  React.ComponentProps<typeof DialogTrigger>["render"]
>;

const cardSchemas = Object.keys(cardSchemaMap);
type CardSchemaKey = keyof typeof cardSchemaMap;

export function AddCardDialog({ trigger }: { trigger: TriggerType }) {
  const addCard = useAtomSet(addCardAtom);

  const [selectedSchemaKey, setSelectedSchemaKey] = useState<
    CardSchemaKey | "Select Card"
  >("Select Card");

  const [title, setTitle] = useState("");

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="bg-neutral-background">
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
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
        >
          <ComboboxTrigger />
          <ComboboxContent>
            <ComboboxInput inPopup placeholder="Search..." />
            <ComboboxList>
              {(item: CardSchemaKey) => (
                <ComboboxItem key={item} value={item}>
                  {annotations(cardSchemaMap[item]).title ?? "Unknown Card"}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
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
            onSubmit={({ _tag, ...values }) => {
              addCard({
                id: crypto.randomUUID(),
                component: _tag,
                title: title,
                params: values,
              });
            }}
          />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="add-card-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
