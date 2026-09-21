import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[background-color,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
        secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3",
        ghost: "text-fg hover:bg-surface-2",
        danger: "bg-danger text-danger-fg hover:opacity-90",
        outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-3.5 text-sm",
        lg: "h-11 px-4 text-sm",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
