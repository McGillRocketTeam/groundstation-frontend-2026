import { cn } from "@/lib/utils/ui";
import { Combobox as ComboboxPrimitive } from "@base-ui-components/react/combobox";
import { CheckIcon, ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import * as React from "react";
import { inputStyle } from "./input";

function Combobox({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Root>) {
  return <ComboboxPrimitive.Root {...props} />;
}

function ComboboxInput({
  className,
  onClear,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & {
  onClear?: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-1 text-sm">
      <ComboboxPrimitive.Input
        className={cn(inputStyle, className)}
        {...props}
      />

      <div className="text-muted absolute right-2 bottom-0 flex h-10 items-center justify-center">
        <ComboboxPrimitive.Clear
          onClick={onClear}
          className="flex h-10 w-6 items-center justify-center p-0"
          aria-label="Clear selection"
        >
          <Cross1Icon className="size-4 translate-y-0.5" />
        </ComboboxPrimitive.Clear>
        <ComboboxPrimitive.Trigger
          className="flex h-10 w-6 items-center justify-center p-0"
          aria-label="Open popup"
        >
          <ChevronDownIcon className="size-4 translate-y-0.5" />
        </ComboboxPrimitive.Trigger>
      </div>
    </div>
  );
}

function ComboboxPortal({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Portal>) {
  return <ComboboxPrimitive.Portal {...props} />;
}

function ComboboxPositioner({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Positioner>) {
  return <ComboboxPrimitive.Positioner {...props} />;
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        "text-muted px-4 py-4 text-sm leading-4 empty:m-0 empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxList({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return <ComboboxPrimitive.List {...props} />;
}

function ComboboxItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "data-[highlighted]:before:bg-muted grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1]",
        className,
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="col-start-1">
        <CheckIcon className="size-3" />
      </ComboboxPrimitive.ItemIndicator>
      <div className="col-start-2 flex flex-row gap-2">{children}</div>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Positioner>) {
  return (
    <ComboboxPortal>
      <ComboboxPrimitive.Positioner
        className="z-30 outline-none"
        sideOffset={4}
      >
        <ComboboxPrimitive.Popup
          className={cn(
            "outline-border max-h-[min(var(--available-height),23rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain bg-[canvas] py-2 shadow-sm outline transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:-outline-offset-1",
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPortal>
  );
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPortal,
  ComboboxPositioner,
};
