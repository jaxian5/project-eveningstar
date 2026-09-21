import { AlertTriangle, Clock, Layers, Package, Pencil, Plus, Printer, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogContent } from "@/components/ui/dialog";
import { Empty, Panel, StatCard } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { Dates } from "@/lib/store/dates";
import { dayLabel, fmtClock, fmtDate, peso } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";
import { BatchDialog, ProductDialog } from "./inventory-dialogs";

const STATUS: Record<string, ["ok" | "warn" | "bad", string]> = {
  ok: ["ok", "In stock"],
  low: ["warn", "Low stock"],
  out: ["bad", "Out of stock"],
};

export function InventoryView() {
  const revision = useApp((s) => s.revision);
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const mutate = useApp((s) => s.mutate);
  void revision;
  const inv = getEngine();
  const report = inv.expiryReport(inv.settings.expiryWarningDays);
  const summary = inv.summary(report);
  const rows = inv.listProducts(filters);
  const cats = inv.categories();
  const reorder = inv.reorderList();
  const [productOpen, setProductOpen] = useState(false);
  const [editSku, setEditSku] = useState<string | null>(null);
  const [batchSku, setBatchSku] = useState<string | null>(null);
  const [confirmSku, setConfirmSku] = useState<string | null>(null);

  function printReorder() {
    document.body.dataset.print = "reorder";
    window.print();
    const done = () => {
      delete document.body.dataset.print;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    setTimeout(done, 1000);
  }

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={summary.products} icon={<Package className="size-4" />} note={`${summary.out} out of sellable stock`} />
        <StatCard label="Needs reorder" value={summary.low + summary.out} icon={<AlertTriangle className="size-4" />} tone="amber" note={`${summary.low} low, ${summary.out} out`} />
        <StatCard label="Expired batches" value={summary.expiredBatches} icon={<Clock className="size-4" />} tone="red" note={summary.expiredBatches ? `About ${peso(summary.expiredValue)} at selling price` : "Nothing to pull out"} emphasis={summary.expiredBatches > 0} />
        <StatCard label="Sellable stock value" value={peso(summary.inventoryValue)} icon={<Tag className="size-4" />} tone="green" note="At selling price, expired excluded" />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel
          title="Products"
          subtitle="Sellable stock leaves out expired units."
          actions={
            <Button onClick={() => { setEditSku(null); setProductOpen(true); }}>
              <Plus className="size-4" /> Add product
            </Button>
          }
        >
          <div className="flex flex-wrap gap-2.5 border-y border-border bg-surface-2 px-5 py-3">
            <Input
              type="search"
              placeholder="Search products"
              aria-label="Search products"
              className="min-w-[180px] flex-[2]"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
            />
            <select
              aria-label="Filter by category"
              className="h-10 min-w-[140px] flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm"
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
            >
              <option value="">All categories</option>
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Filter by stock status"
              className="h-10 min-w-[140px] flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
            >
              <option value="">All stock levels</option>
              <option value="ok">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left text-muted">
                  <th className="px-5 py-2.5 font-medium">Product</th>
                  <th className="px-3 py-2.5 font-medium">SKU</th>
                  <th className="px-3 py-2.5 text-right font-medium">Sellable</th>
                  <th className="px-3 py-2.5 font-medium">Next expiry</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 text-right font-medium">Price</th>
                  <th className="px-5 py-2.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ product: p, info }) => {
                  const [tone, label] = STATUS[info.status]!;
                  const statusLabel = info.status === "out" && info.expired > 0 ? "Expired only" : label;
                  return (
                    <tr key={p.sku} className="border-t border-border hover:bg-accent-soft/50">
                      <td className="px-5 py-3">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted">{p.category}</div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">{p.sku}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        <strong>{info.sellable}</strong>
                        {info.expired ? <div className="text-xs font-semibold text-danger">+{info.expired} expired</div> : null}
                      </td>
                      <td className="px-3 py-3">
                        {info.nextExpiry ? (
                          <div>
                            <span className="whitespace-nowrap">{fmtDate(info.nextExpiry)}</span>
                            <div className="mt-1">
                              <Badge tone={Dates.daysBetween(inv.today(), info.nextExpiry) <= inv.settings.expiryWarningDays ? "warn" : "neutral"}>
                                {dayLabel(Dates.daysBetween(inv.today(), info.nextExpiry))}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted">No expiry</span>
                        )}
                      </td>
                      <td className="px-3 py-3"><Badge tone={tone}>{statusLabel}</Badge></td>
                      <td className="px-3 py-3 text-right tabular-nums">{peso(p.price)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon-sm" aria-label={`Batches of ${p.name}`} onClick={() => setBatchSku(p.sku)}>
                          <Layers className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${p.name}`} onClick={() => { setEditSku(p.sku); setProductOpen(true); }}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${p.name}`} onClick={() => setConfirmSku(p.sku)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 ? <Empty title="No products match" body="Clear the search or filters, or add a new product." /> : null}
          </div>
        </Panel>

        <div className="grid gap-5">
          <Panel title="Expiring soon" subtitle={`Expired, or within ${inv.settings.expiryWarningDays} days.`} tone="watch">
            {report.expired.concat(report.soon).slice(0, 5).length ? (
              report.expired.concat(report.soon).slice(0, 5).map((r) => (
                <div key={r.batch.id} className="flex items-center justify-between gap-2 border-t border-border px-5 py-2.5">
                  <div>
                    <strong className="block text-sm">{r.product.name}</strong>
                    <small className="text-muted">{r.batch.qty} pcs, {fmtDate(r.batch.expiry_date!)}</small>
                  </div>
                  <Badge tone={r.daysLeft < 0 ? "bad" : "warn"}>{dayLabel(r.daysLeft)}</Badge>
                </div>
              ))
            ) : (
              <p className="px-5 pb-4 text-sm text-muted">Nothing is close to expiring.</p>
            )}
          </Panel>

          <Panel
            title="Reorder list"
            subtitle="Low or out of sellable stock."
            actions={
              <Button variant="secondary" size="sm" onClick={printReorder} disabled={reorder.length === 0}>
                <Printer className="size-3.5" /> Print
              </Button>
            }
          >
            {reorder.length ? (
              reorder.slice(0, 8).map(({ product: p, info }) => (
                <div key={p.sku} className="flex items-center justify-between gap-2 border-t border-border px-5 py-2.5">
                  <div>
                    <strong className="block text-sm">{p.name}</strong>
                    <small className="text-muted">{info.sellable} sellable, reorder at {p.reorder_level}</small>
                  </div>
                  <Badge tone={info.status === "out" ? "bad" : "warn"}>{info.status === "out" ? "Out" : "Low"}</Badge>
                </div>
              ))
            ) : (
              <p className="px-5 pb-4 text-sm text-muted">Every product is above its reorder level.</p>
            )}
          </Panel>

          <Panel title="Recent activity">
            <ul className="grid gap-2.5 px-5 pb-4 text-sm text-muted">
              {inv.activity.length ? (
                inv.activity.slice(0, 6).map((a, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>{a.message}</span>
                    <time className="shrink-0 text-xs">{fmtClock(a.time)}</time>
                  </li>
                ))
              ) : (
                <li>No changes yet.</li>
              )}
            </ul>
          </Panel>
        </div>
      </div>

      <div id="reorder-print" className="hidden print:block">
        <h1 className="font-display text-2xl font-semibold">{inv.settings.storeName}</h1>
        <p>Reorder list · {fmtDate(inv.today())}</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr>
              <th className="border-b py-1 text-left">Product</th>
              <th className="border-b py-1 text-left">SKU</th>
              <th className="border-b py-1 text-right">Sellable</th>
              <th className="border-b py-1 text-right">Reorder at</th>
              <th className="border-b py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {reorder.map(({ product: p, info }) => (
              <tr key={p.sku}>
                <td className="py-1">{p.name}</td>
                <td className="py-1">{p.sku}</td>
                <td className="py-1 text-right">{info.sellable}</td>
                <td className="py-1 text-right">{p.reorder_level}</td>
                <td className="py-1">{info.status === "out" ? "Out of stock" : "Low stock"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {reorder.length === 0 ? <p>Nothing to reorder.</p> : null}
      </div>

      <ProductDialog open={productOpen} sku={editSku} categories={cats} onClose={() => setProductOpen(false)} />
      <BatchDialog sku={batchSku} onClose={() => setBatchSku(null)} />
      <Dialog open={!!confirmSku} onOpenChange={(o) => !o && setConfirmSku(null)}>
        <DialogContent title="Delete product" description="This removes the product and all of its batches. It cannot be undone.">
          <DialogActions>
            <Button variant="secondary" onClick={() => setConfirmSku(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!confirmSku) return;
                const name = inv.getProduct(confirmSku)?.name;
                mutate((e) => e.removeProduct(confirmSku));
                toast.success(`${name} deleted.`);
                setConfirmSku(null);
              }}
            >
              Delete product
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
