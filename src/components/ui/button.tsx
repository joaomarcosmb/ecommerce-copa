import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-2 rounded-full font-['Poppins',sans-serif] font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-700 text-white shadow-md hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-700/30 active:bg-blue-900",
        secondary:
          "bg-green-700 text-white shadow-md hover:bg-green-800 hover:shadow-lg hover:shadow-green-700/30 active:bg-green-900",
        outline:
          "border-2 border-blue-700 text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-semibold",
        ghost: "text-slate-900 hover:bg-slate-100 active:bg-slate-200",
        destructive:
          "bg-red-700 text-white shadow-md hover:bg-red-800 hover:shadow-lg hover:shadow-red-700/30 active:bg-red-900",
        link: "text-blue-700 hover:underline active:text-blue-800",
      },
      size: {
        sm: "px-4 py-1.5 text-[12px] leading-[16px]",
        md: "px-6 py-2 text-[14px] leading-[20px]",
        lg: "px-8 py-3 text-[16px] leading-[24px]",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
