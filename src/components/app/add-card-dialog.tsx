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
import { ScrollArea } from "../ui/scroll-area";
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

        <ScrollArea className="h-full max-h-[calc(100vh-15rem)]">
          <AddCardForm />
        </ScrollArea>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Add</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
