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
import type React from "react";
import { TextCardConfiguration } from "../cards/text";
import { AddCardForm } from "./add-card-form";

type TriggerType = NonNullable<
  React.ComponentProps<typeof DialogTrigger>["render"]
>;

export function AddCardDialog({ trigger }: { trigger: TriggerType }) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription className="sr-only">
            Configure your card for dashboard.
          </DialogDescription>
        </DialogHeader>

        {/* <ScrollArea className="h-full max-h-[calc(100vh-15rem)] overflow-x-auto"> */}
        <AddCardForm
          schema={TextCardConfiguration}
          onSubmit={(values) => console.log(values)}
        />
        {/* </ScrollArea> */}

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
