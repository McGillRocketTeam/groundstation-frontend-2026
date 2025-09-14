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
        <div>Placeholder Content</div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Add</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
