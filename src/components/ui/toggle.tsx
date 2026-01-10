import { cn } from "@/lib/utils/ui";
import { Toggle as TogglePrimitive } from "@base-ui-components/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui-components/react/toggle-group";

export function Toggle({
  ...props
}: React.ComponentProps<typeof TogglePrimitive>) {
  return (
    <TogglePrimitive
      {...props}
      className={cn(props.className, "aria-pressed:bg-muted p-1 px-4")}
    />
  );
}

export function ToggleGroup({
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive>) {
  return (
    <ToggleGroupPrimitive
      {...props}
      className={cn("flex w-min flex-row gap-1 border p-1", props.className)}
    />
  );
}
