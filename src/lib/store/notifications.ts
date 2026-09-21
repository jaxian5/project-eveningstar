import { dayLabel } from "./format";
import type { Inventory } from "./inventory";
import type { AppNotification } from "./types";
import { peso } from "./format";

export function buildNotifications(inv: Inventory): AppNotification[] {
  const s = inv.settings;
  if (!s.notificationsEnabled) return [];
  const out: AppNotification[] = [];
  const dismissed = new Set(s.dismissedIds || []);

  if (s.notifyExpiry) {
    const rep = inv.expiryReport(s.expiryWarningDays);
    for (const r of [...rep.expired, ...rep.soon]) {
      const id = `expiry:${r.batch.id}`;
      if (dismissed.has(id)) continue;
      out.push({
        id,
        type: "expiry",
        title: r.daysLeft < 0 ? "Expired stock" : "Near expiration",
        body: `${r.product.name} — ${r.batch.qty} pcs, ${dayLabel(r.daysLeft).toLowerCase()}`,
        severity: r.daysLeft < 0 ? "bad" : "warn",
        view: "expiry",
      });
    }
  }

  if (s.notifyLowStock) {
    for (const row of inv.reorderList()) {
      const id = `stock:${row.product.sku}:${row.info.sellable}`;
      if (dismissed.has(id)) continue;
      out.push({
        id,
        type: "low_stock",
        title: row.info.status === "out" ? "Out of stock" : "Low stock",
        body: `${row.product.name} — ${row.info.sellable} sellable (reorder at ${row.product.reorder_level})`,
        severity: row.info.status === "out" ? "bad" : "warn",
        view: "inventory",
      });
    }
  }

  if (s.notifyDebts) {
    const today = inv.today();
    for (const d of inv.openDebts()) {
      if (d.dueDate > today) continue;
      const id = `debt:${d.id}:${d.dueDate}`;
      if (dismissed.has(id)) continue;
      const overdue = d.dueDate < today;
      out.push({
        id,
        type: "debt",
        title: overdue ? "Overdue utang" : "Utang due today",
        body: `${d.customerName} — ${peso(d.remaining)} due ${d.dueDate}`,
        severity: "bad",
        view: "utang",
      });
    }
  }

  const rank = { bad: 0, warn: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function notificationCounts(list: AppNotification[]) {
  return {
    total: list.length,
    expiry: list.filter((n) => n.type === "expiry").length,
    low_stock: list.filter((n) => n.type === "low_stock").length,
    debt: list.filter((n) => n.type === "debt").length,
  };
}
