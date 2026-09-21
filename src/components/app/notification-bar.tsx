import { AlertTriangle, BellOff, Clock, PackageMinus, Wallet, X } from "lucide-react";
import { getEngine, useApp } from "@/lib/store/app-store";
import { buildNotifications, notificationCounts } from "@/lib/store/notifications";
import type { AppNotification } from "@/lib/store/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ICONS = {
  expiry: Clock,
  low_stock: PackageMinus,
  debt: Wallet,
};

export function NotificationBar() {
  const revision = useApp((s) => s.revision);
  const notifyOpen = useApp((s) => s.notifyOpen);
  const setView = useApp((s) => s.setView);
  const mutate = useApp((s) => s.mutate);
  void revision;
  const inv = getEngine();
  if (!notifyOpen || !inv.settings.notificationsEnabled) return null;
  const notes = buildNotifications(inv);
  const counts = notificationCounts(notes);
  if (notes.length === 0) return null;

  function dismiss(id: string) {
    mutate((eng) => {
      const ids = new Set(eng.settings.dismissedIds || []);
      ids.add(id);
      eng.settings.dismissedIds = [...ids];
    });
  }

  function dismissAll() {
    mutate((eng) => {
      const ids = new Set(eng.settings.dismissedIds || []);
      for (const n of notes) ids.add(n.id);
      eng.settings.dismissedIds = [...ids];
    });
  }

  const shown = notes.slice(0, 6);

  return (
    <section className="mb-5 overflow-hidden rounded-xl border border-warn/40 bg-warn-bg">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
          <div>
            <p className="text-sm font-semibold text-warn">
              {counts.total} notification{counts.total === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-warn/80">
              {counts.expiry ? `${counts.expiry} near expiry` : null}
              {counts.expiry && (counts.low_stock || counts.debt) ? " · " : null}
              {counts.low_stock ? `${counts.low_stock} low stock` : null}
              {counts.low_stock && counts.debt ? " · " : null}
              {counts.debt ? `${counts.debt} overdue utang` : null}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={dismissAll}>
            Clear all
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Hide notifications" onClick={() => useApp.getState().setNotifyOpen(false)}>
            <BellOff className="size-4" />
          </Button>
        </div>
      </div>
      <ul className="divide-y divide-warn/20 border-t border-warn/20">
        {shown.map((n) => (
          <NoticeRow key={n.id} n={n} onOpen={() => setView(n.view)} onDismiss={() => dismiss(n.id)} />
        ))}
      </ul>
      {notes.length > shown.length ? (
        <p className="px-4 py-2 text-xs text-warn/80">Showing {shown.length} of {notes.length}. Open Expiry, Inventory, or Utang for the rest.</p>
      ) : null}
    </section>
  );
}

function NoticeRow({ n, onOpen, onDismiss }: { n: AppNotification; onOpen: () => void; onDismiss: () => void }) {
  const Icon = ICONS[n.type];
  return (
    <li className="flex items-start gap-3 px-4 py-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-warn" />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-fg">{n.title}</span>
          <Badge tone={n.severity === "bad" ? "bad" : "warn"}>{n.type === "debt" ? "Utang" : n.type === "low_stock" ? "Stock" : "Expiry"}</Badge>
        </div>
        <p className="text-sm text-muted">{n.body}</p>
      </button>
      <Button variant="ghost" size="icon-sm" aria-label="Dismiss" onClick={onDismiss}>
        <X className="size-3.5" />
      </Button>
    </li>
  );
}
