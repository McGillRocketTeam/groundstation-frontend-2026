import {
  Combobox as ComboboxPrimitive,
  mergeProps,
} from "@base-ui-components/react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

function Combobox<SelectedValue>(
  props: React.ComponentProps<typeof ComboboxPrimitive.Root<SelectedValue>>,
) {
  return <ComboboxPrimitive.Root {...props} />;
}

function ComboboxInput(
  props: React.ComponentProps<typeof ComboboxPrimitive.Input>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Input>(
    {
      className:
        "h-10 w-full font-normal border pl-3.5 text-base focus:outline focus:outline-1 focus:-outline-offset-1 aria-invalid:ring-error/15 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
    },
    props,
  );

  return <ComboboxPrimitive.Input {...combinedProps} />;
}

function ComboboxTrigger(
  props: React.ComponentProps<typeof ComboboxPrimitive.Trigger>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Trigger>(
    {
      className:
        "flex bg-[canvas] h-10 min-w-[12rem] items-center justify-between gap-3 border pr-3 pl-3.5 text-base select-none hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-muted cursor-default aria-invalid:ring-error/15 dark:aria-invalid:ring-error/40 aria-invalid:border-error md:text-sm",
    },
    props,
  );

  return <ComboboxPrimitive.Trigger {...combinedProps} />;
}

function ComboboxValue(
  props: React.ComponentProps<typeof ComboboxPrimitive.Value>,
) {
  return <ComboboxPrimitive.Value {...props} />;
}

function ComboboxIcon(
  props: React.ComponentProps<typeof ComboboxPrimitive.Icon>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Icon>(
    {
      className: "flex",
      children: <CaretSortIcon />,
    },
    props,
  );

  return <ComboboxPrimitive.Icon {...combinedProps} />;
}

function ComboboxPortal(
  props: React.ComponentProps<typeof ComboboxPrimitive.Portal>,
) {
  return <ComboboxPrimitive.Portal {...props} />;
}

function ComboboxPositioner(
  props: React.ComponentProps<typeof ComboboxPrimitive.Positioner>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Positioner>(
    {
      align: "start",
      sideOffset: 4,
    },
    props,
  );

  return <ComboboxPrimitive.Positioner {...combinedProps} />;
}

function ComboboxPopup(
  props: React.ComponentProps<typeof ComboboxPrimitive.Popup>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Popup>(
    {
      className:
        "[--input-container-height:3rem] origin-[var(--transform-origin)] max-w-[var(--available-width)] max-h-[min(24rem,var(--available-height))] bg-[canvas] shadow-lg text-gray-900 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300 duration-100",
      "aria-label": "Select One",
    },
    props,
  );

  return <ComboboxPrimitive.Popup {...combinedProps} />;
}

function ComboboxEmpty(
  props: React.ComponentProps<typeof ComboboxPrimitive.Empty>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Empty>(
    {
      className:
        "p-4 text-[0.925rem] leading-4 text-muted-foreground empty:m-0 empty:p-0",
    },
    props,
  );

  return <ComboboxPrimitive.Empty {...combinedProps} />;
}

function ComboboxList(
  props: React.ComponentProps<typeof ComboboxPrimitive.List>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.List>(
    {
      className:
        "overflow-y-auto scroll-py-2 py-2 overscroll-contain max-h-[min(calc(24rem-var(--input-container-height)),calc(var(--available-height)-var(--input-container-height)))] empty:p-0",
    },
    props,
  );

  return <ComboboxPrimitive.List {...combinedProps} />;
}

function ComboboxItem(
  props: React.ComponentProps<typeof ComboboxPrimitive.Item>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.Item>(
    {
      className:
        "grid min-w-[var(--anchor-width)] cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:bg-gray-900 md:text-sm",
    },
    props,
  );

  return <ComboboxPrimitive.Item {...combinedProps} />;
}

function ComboboxItemIndicator(
  props: React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>,
) {
  const combinedProps = mergeProps<typeof ComboboxPrimitive.ItemIndicator>(
    {
      className: "col-start-1",
      children: <CheckIcon />,
    },
    props,
  );

  return <ComboboxPrimitive.ItemIndicator {...combinedProps} />;
}

export {
  Combobox,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxTrigger,
  ComboboxValue,
};
