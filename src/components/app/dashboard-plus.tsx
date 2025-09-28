import { cn } from "@/lib/utils/ui";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddCardDialog } from "./add-card-dialog";

export function DashboardPlus() {
  return (
    <AddCardDialog
      trigger={(props) => (
        <button
          className={cn(
            "grid aspect-square h-full place-items-center focus-visible:border focus-visible:outline-none",
          )}
          {...props}
        >
          <PlusIcon />
        </button>
      )}
    />
  );
}
