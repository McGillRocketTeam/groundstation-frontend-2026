import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        default:
          "bg-neutral text-neutral-background hover:bg-neutral/80 border",
        destructive:
          "bg-error text-white hover:bg-error/80 focus-visible:ring-error/20 dark:text-error-background",
        outline:
          "bg-neutral-background text-neutral hover:bg-neutral-background border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  render,
  className,
  variant,
  size,
  ...props
}: useRender.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  const defaultProps: useRender.ElementProps<"button"> = {
    className: cn(buttonVariants({ variant, size, className })),
    type: "button",
    children: "Click me",
  };
  const element = useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(defaultProps, props),
  });
  return element;
}

export { Button, buttonVariants };
