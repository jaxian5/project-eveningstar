import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogContent } from "@/components/ui/dialog";
import { Empty } from "@/components/ui/panel";
import { Field, Input } from "@/components/ui/input";
import { Dates } from "@/lib/store/dates";
import { dayLabel, fmtDate } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";

export function ProductDialog({
  open,
  sku,
  categories,
  onClose,
}: {
  open: boolean;
  sku: string | null;
  categories: string[];
  onClose: () => void;
}) {
  const mutate = useApp((s) => s.mutate);
  const inv = getEngine();
  const existing = sku ? inv.getProduct(sku) : null;
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    reorder: "",
    qty: "",
    expiry: "",
  });

  useEffect(() => {
    if (!open) return;
    setError("");
    if (existing) {
      setForm({
        name: existing.name,
        sku: existing.sku,
        category: existing.category,
        price: String(existing.price),
        cost: String(existing.cost ?? ""),
        reorder: String(existing.reorder_level),
        qty: "",
        expiry: "",
      });
    } else {
      setForm({ name: "", sku: "", category: "", price: "", cost: "", reorder: "", qty: "", expiry: "" });
    }
  }, [open, existing]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      price: form.price,
      cost: form.cost,
      reorder_level: form.reorder,
    };
    mutate((eng) => {
      if (existing) {
        const r = eng.updateProduct(existing.sku, data);
        if (!r.ok) {
          setError(r.error);
          return;
        }
        toast.success(`${r.product.name} updated.`);
        onClose();
      } else {
        if (form.qty !== "") {
          const c = eng.checkBatch(form.qty, form.expiry);
          if (!c.ok) {
            setError(c.error);
            return;
          }
        }
        const r = eng.addProduct({ ...data, sku: form.sku });
        if (!r.ok) {
          setError(r.error);
          return;
        }
        if (form.qty !== "") eng.addBatch(r.product.sku, form.qty, form.expiry);
        toast.success(`${r.product.name} added.`);
        onClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent title={existing ? "Edit product" : "Add product"} description={existing ? "To change stock, use the batches button on the product row." : undefined}>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Product name" className="sm:col-span-2">
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="SKU">
            <Input required disabled={!!existing} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </Field>
          <Field label="Category">
            <Input list="category-options" placeholder="e.g. Snacks" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Price (PHP)">
            <Input type="number" min={0} step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <Field label="Cost (PHP)">
            <Input type="number" min={0} step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </Field>
          <Field label="Reorder level">
            <Input type="number" min={0} step="1" placeholder={String(inv.defaultReorder)} value={form.reorder} onChange={(e) => setForm({ ...form, reorder: e.target.value })} />
          </Field>
          {!existing ? (
            <>
              <p className="sm:col-span-2 mt-1 border-t border-border pt-3 text-sm font-semibold">First delivery (optional)</p>
              <Field label="Quantity">
                <Input type="number" min={1} step="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
              </Field>
              <Field label="Expiry date">
                <Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </Field>
            </>
          ) : null}
          {error ? <p className="sm:col-span-2 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p> : null}
          <div className="sm:col-span-2">
            <DialogActions>
              <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit">{existing ? "Save changes" : "Save product"}</Button>
            </DialogActions>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BatchDialog({ sku, onClose }: { sku: string | null; onClose: () => void }) {
  const revision = useApp((s) => s.revision);
  const mutate = useApp((s) => s.mutate);
  void revision;
  const inv = getEngine();
  const p = sku ? inv.getProduct(sku) : null;
  const info = sku ? inv.stockInfo(sku) : null;
  const batches = sku ? inv.batchesOf(sku) : [];
  const [qty, setQty] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const [removeId, setRemoveId] = useState<number | null>(null);

  function receive(e: FormEvent) {
    e.preventDefault();
    if (!sku) return;
    mutate((eng) => {
      const r = eng.addBatch(sku, qty, expiry);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setError("");
      setQty("");
      setExpiry("");
      toast.success(`Received ${r.batch.qty} pcs.`);
    });
  }

  return (
    <Dialog open={!!sku} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        wide
        title={p ? `Batches: ${p.name}` : "Batches"}
        description={p && info ? `${p.sku}. ${info.sellable} sellable, ${info.expired} expired. Oldest expiry is sold first.` : undefined}
      >
        <div className="max-h-80 overflow-auto rounded-[10px] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-muted">
                <th className="px-3 py-2 font-medium">Batch</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Expiry</th>
                <th className="px-3 py-2 font-medium">Received</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => {
                const days = b.expiry_date ? Dates.daysBetween(inv.today(), b.expiry_date) : null;
                return (
                  <tr key={b.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">#{b.id}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{b.qty}</td>
                    <td className="px-3 py-2">{b.expiry_date ? fmtDate(b.expiry_date) : <span className="text-muted">None</span>}</td>
                    <td className="px-3 py-2">{fmtDate(b.received_date)}</td>
                    <td className="px-3 py-2">
                      {days == null ? <Badge tone="neutral">No expiry</Badge> : <Badge tone={days < 0 ? "bad" : days <= inv.settings.expiryWarningDays ? "warn" : "neutral"}>{dayLabel(days)}</Badge>}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <Button variant="ghost" size="icon-sm" aria-label={`Remove batch ${b.id}`} onClick={() => setRemoveId(b.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {batches.length === 0 ? <Empty title="No stock on hand" body="Receive a delivery below." /> : null}
        </div>
        <form onSubmit={receive} className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
          <Field label="Quantity received" className="min-w-[140px] flex-1">
            <Input type="number" min={1} step={1} required value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <Field label="Expiry date" className="min-w-[160px] flex-1">
            <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </Field>
          <Button type="submit">Receive stock</Button>
        </form>
        {error ? <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p> : null}

        <Dialog open={removeId != null} onOpenChange={(o) => !o && setRemoveId(null)}>
          <DialogContent title="Remove this batch?" description="Use this for spoiled, damaged or mistaken entries.">
            <DialogActions>
              <Button variant="secondary" onClick={() => setRemoveId(null)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (sku == null || removeId == null) return;
                  mutate((e) => e.removeBatch(sku, removeId));
                  setRemoveId(null);
                }}
              >
                Remove batch
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
