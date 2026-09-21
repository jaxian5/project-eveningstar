import {
  Bell,
  BellOff,
  Clock,
  Layers,
  Menu,
  Moon,
  Package,
  Settings,
  ShoppingCart,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { getEngine, useApp } from "@/lib/store/app-store";
import { buildNotifications } from "@/lib/store/notifications";
import type { AppView } from "@/lib/store/types";
import { Button } from "@/components/ui/button";

const NAV: { view: AppView; label: string; icon: typeof Layers }[] = [
  { view: "inventory", label: "Inventory", icon: Layers },
  { view: "billing", label: "Billing", icon: ShoppingCart },
  { view: "expiry", label: "Expiry watch", icon: Clock },
  { view: "utang", label: "Utang", icon: Wallet },
  { view: "finance", label: "Finance", icon: Package },
  { view: "settings", label: "Settings", icon: Settings },
];

const TITLES: Record<AppView, string> = {
  inventory: "Inventory",
  billing: "Billing",
  expiry: "Expiry watch",
  utang: "Utang / Debts",
  finance: "Finance",
  settings: "Settings",
};

export function Shell({ children }: { children: ReactNode }) {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const revision = useApp((s) => s.revision);
  const notifyOpen = useApp((s) => s.notifyOpen);
  const setNotifyOpen = useApp((s) => s.setNotifyOpen);
  const updateSettings = useApp((s) => s.updateSettings);
  const [open, setOpen] = useState(false);
  void revision;
  const inv = getEngine();
  const notes = buildNotifications(inv);
  const expiryCount = inv.expiryReport(inv.settings.expiryWarningDays);
  const expiryBadge = expiryCount.expired.length + expiryCount.soon.length;
  const theme = inv.settings.theme || "light";
  const today = new Date().toLocaleDateString(inv.settings.locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function go(v: AppView) {
    setView(v);
    setOpen(false);
  }

  return (
    <div className="flex min-h-dvh">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/50 md:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col gap-1.5 overflow-y-auto bg-nav p-3.5 text-nav-ink md:sticky md:top-0 md:h-dvh md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-3 flex items-center gap-3 px-2 pt-1">
          <span className="grid size-9 place-items-center rounded-[10px] bg-accent text-accent-foreground">
            <Package className="size-4.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-[1.05rem] font-semibold text-white">{inv.settings.storeName}</div>
            <div className="text-xs text-nav-muted">Tindahan ledger</div>
          </div>
        </div>
        <nav className="grid gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.view;
            const badge =
              item.view === "expiry" ? expiryBadge : item.view === "utang" ? inv.financeSummary().overdueDebts : 0;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => go(item.view)}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-nav-ink transition-colors",
                  active ? "bg-white/15 text-white" : "hover:bg-white/10",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge > 0 ? (
                  <span className="min-w-[22px] rounded-full bg-warn px-1.5 text-center text-[11px] font-bold text-ink">
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <p className="mt-auto px-3 pt-4 text-xs text-nav-muted">
          FEFO billing · expiry watch · utang · finance. Data stays in this browser.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 md:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="secondary" size="icon" className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
            <h1 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{TITLES[view]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted sm:inline">
              {today}
            </span>
            <Button
              variant={notifyOpen ? "secondary" : "ghost"}
              size="icon"
              aria-label={notifyOpen ? "Turn notifications off" : "Turn notifications on"}
              title="Toggle notifications"
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="relative"
            >
              {notifyOpen ? <Bell className="size-4" /> : <BellOff className="size-4" />}
              {notifyOpen && notes.length > 0 ? (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" />
              ) : null}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => updateSettings({ theme: theme === "dark" ? "light" : "dark" })}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 pb-12 md:px-7">{children}</div>
      </div>
    </div>
  );
}
