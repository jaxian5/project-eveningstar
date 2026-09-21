import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-fg-subtle",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("grid gap-1.5 text-sm font-medium text-fg", className)} {...props} />;
}

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-1.5 text-sm font-medium text-fg", className)}>
      {label}
      {children}
    </label>
  );
}
