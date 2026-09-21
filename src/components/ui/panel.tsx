import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
  tone,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  tone?: "watch" | "none";
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface",
        tone === "watch" && "border-warn/40",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
          <div className="min-w-0 flex-1">
            {title ? <h2 className="text-base font-semibold tracking-tight">{title}</h2> : null}
            {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-none flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  note,
  icon,
  tone,
  emphasis,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  icon: ReactNode;
  tone?: "amber" | "red" | "green" | "teal";
  emphasis?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative rounded-[10px] border border-border bg-surface px-5 py-4 pl-5",
        emphasis && "bg-warn-bg border-warn/35",
      )}
    >
      <span
        className={cn(
          "absolute top-3 bottom-3 left-0 w-1 rounded-r",
          tone === "amber" && "bg-warn",
          tone === "red" && "bg-danger",
          tone === "green" && "bg-ok",
          tone === "teal" && "bg-accent",
          !tone && "bg-accent",
        )}
      />
      <div className="flex items-center justify-between text-sm font-medium text-muted">
        <span>{label}</span>
        <span className="text-muted">{icon}</span>
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {note ? <div className="mt-0.5 text-xs text-muted">{note}</div> : null}
    </article>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-muted">
      <strong className="mb-1 block text-fg">{title}</strong>
      {body}
    </div>
  );
}
