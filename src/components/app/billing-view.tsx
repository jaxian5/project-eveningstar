import { Printer, Undo2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogContent } from "@/components/ui/dialog";
import { Empty, Panel } from "@/components/ui/panel";
import { Field, Input } from "@/components/ui/input";
import { Dates } from "@/lib/store/dates";
import { fmtTime, peso } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";
import type { PaymentMethod, Sale } from "@/lib/store/types";

export function BillingView() {
  const revision = useApp((s) => s.revision);
  const cart = useApp((s) => s.cart);
  const setCart = useApp((s) => s.setCart);
  const billSearch = useApp((s) => s.billSearch);
  const setBillSearch = useApp((s) => s.setBillSearch);
  const lastSaleId = useApp((s) => s.lastSaleId);
  const setLastSale = useApp((s) => s.setLastSale);
  const mutate = useApp((s) => s.mutate);
  void revision;
  const inv = getEngine();
  const [skuInput, setSkuInput] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [returnSale, setReturnSale] = useState<Sale | null>(null);

  const results = inv.listProducts({ q: billSearch }).slice(0, 40);
  const allResults = inv.listProducts({ q: billSearch });
  const lines = cart
    .map((l) => {
      const p = inv.getProduct(l.sku);
      if (!p) return null;
      return { ...l, product: p, amount: (Math.round(p.price * 100) * l.qty) / 100 };
    })
    .filter((l): l is NonNullable<typeof l> => !!l);
  const totalCents = lines.reduce((s, l) => s + Math.round(l.product.price * 100) * l.qty, 0);
  const sale = lastSaleId != null ? inv.sales.find((s) => s.id === lastSaleId) : inv.sales[inv.sales.length - 1];
  const recent = [...inv.sales].slice(-8).reverse();

  function addToCart(sku: string, n = 1) {
    const p = inv.getProduct(sku);
    if (!p) return false;
    const info = inv.stockInfo(p.sku)!;
    const line = cart.find((l) => l.sku === p.sku);
    const have = line ? line.qty : 0;
    if (have + n > info.sellable) {
      toast.error(
        info.sellable === 0
          ? `${p.name} has no sellable stock${info.expired ? " (only expired batches are left)" : ""}.`
          : `Only ${info.sellable} of ${p.name} available.`,
      );
      return false;
    }
    if (line) setCart(cart.map((l) => (l.sku === p.sku ? { ...l, qty: l.qty + n } : l)));
    else setCart([...cart, { sku: p.sku, qty: n }]);
    return true;
  }

  function printSlip() {
    document.body.dataset.print = "slip";
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
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel title="New sale" subtitle="Type or scan a SKU and press Enter, or pick a product below.">
          <div className="flex flex-wrap gap-2.5 border-y border-border bg-surface-2 px-5 py-3">
            <Input
              placeholder="SKU, then Enter"
              aria-label="SKU to add to cart"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const v = skuInput.trim();
                if (!v) return;
                const p = inv.getProduct(v);
                if (!p) {
                  toast.error(`No product has the SKU "${v.toUpperCase()}".`);
                  return;
                }
                if (addToCart(p.sku, 1)) setSkuInput("");
              }}
            />
            <Input
              type="search"
              placeholder="Search by name"
              aria-label="Search products by name"
              value={billSearch}
              onChange={(e) => setBillSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {results.map(({ product: p, info }) => (
              <button
                key={p.sku}
                type="button"
                disabled={info.sellable === 0}
                onClick={() => addToCart(p.sku, 1)}
                className="flex w-full items-center justify-between gap-3 border-t border-border px-5 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent-soft"
              >
                <span>
                  <strong className="block text-sm">{p.name}</strong>
                  <small className="text-muted">
                    {p.sku}, {p.category}
                  </small>
                </span>
                <span className="text-right tabular-nums">
                  <strong className="block text-sm">{peso(p.price)}</strong>
                  <small className="text-muted">
                    {info.sellable ? `${info.sellable} available` : info.expired ? "Expired only" : "Out of stock"}
                  </small>
                </span>
              </button>
            ))}
            {allResults.length > results.length ? (
              <p className="px-5 py-3 text-sm text-muted">
                Showing the first {results.length} of {allResults.length}. Narrow the search to see more.
              </p>
            ) : null}
            {allResults.length === 0 ? <Empty title="No products found" body="Check the spelling or try the SKU." /> : null}
          </div>
        </Panel>

        <Panel
          title="Cart"
          actions={
            <Button variant="ghost" size="sm" disabled={!lines.length} onClick={() => setCart([])}>
              Clear cart
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left text-muted">
                  <th className="px-5 py-2.5 font-medium">Item</th>
                  <th className="px-3 py-2.5 text-right font-medium">Price</th>
                  <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                  <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.sku} className="border-t border-border">
                    <td className="px-5 py-2">
                      <div className="font-semibold">{l.product.name}</div>
                      <div className="font-mono text-xs text-muted">{l.sku}</div>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{peso(l.product.price)}</td>
                    <td className="px-3 py-2 text-right">
                      <Input
                        className="ml-auto h-9 w-[72px] text-center"
                        type="number"
                        min={1}
                        step={1}
                        value={l.qty}
                        aria-label={`Quantity of ${l.product.name}`}
                        onChange={(e) => {
                          const max = inv.stockInfo(l.sku)?.sellable ?? 0;
                          let q = parseInt(e.target.value, 10);
                          if (!Number.isInteger(q) || q < 1) q = 1;
                          if (max < 1) setCart(cart.filter((x) => x.sku !== l.sku));
                          else {
                            if (q > max) {
                              q = max;
                              toast.error(`Only ${max} available.`);
                            }
                            setCart(cart.map((x) => (x.sku === l.sku ? { ...x, qty: q } : x)));
                          }
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{peso(l.amount)}</td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="icon-sm" aria-label={`Remove ${l.product.name}`} onClick={() => setCart(cart.filter((x) => x.sku !== l.sku))}>
                        <X className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lines.length === 0 ? <Empty title="The cart is empty" body="Add items by SKU or from the list." /> : null}
          </div>
          <div className="flex items-baseline justify-between border-t border-border px-5 pt-4">
            <span>Total</span>
            <strong className="font-display text-3xl tabular-nums">{peso(totalCents / 100)}</strong>
          </div>
          <div className="px-5 pt-2 pb-5">
            <Button className="h-12 w-full" disabled={!lines.length} onClick={() => setCheckoutOpen(true)}>
              Complete sale
            </Button>
          </div>
        </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Panel
          title="Sales slip"
          subtitle="An itemized record for the customer. Not an official receipt."
          actions={
            <Button variant="secondary" size="sm" disabled={!sale} onClick={printSlip}>
              <Printer className="size-3.5" /> Print slip
            </Button>
          }
        >
          <div id="sales-slip" className="mx-5 mb-5 max-w-[340px] rounded-md border border-dashed border-muted bg-white p-4 font-mono text-[13px] text-zinc-900">
            {sale ? (
              <>
                <h3 className="text-center font-sans text-base font-semibold">{inv.settings.storeName}</h3>
                <p className="text-center">Sales slip #{sale.id}</p>
                <p className="text-center">{fmtTime(sale.time)}</p>
                <p className="text-center text-xs uppercase tracking-wide">
                  {sale.payment === "utang" ? `UTANG · ${sale.customerName}` : "CASH"}
                  {sale.status !== "complete" ? ` · ${sale.status === "returned" ? "RETURNED" : "PARTIAL RETURN"}` : ""}
                </p>
                <hr className="my-2.5 border-dashed border-zinc-500" />
                {sale.lines.map((l) => (
                  <div key={l.sku}>
                    <div className="flex justify-between gap-2">
                      <span>
                        {l.qty} × {l.name}
                      </span>
                      <span>{peso(l.amount)}</span>
                    </div>
                    <div className="mb-1 pl-3 text-zinc-500">@ {peso(l.price)}</div>
                  </div>
                ))}
                {sale.refundedAmount > 0 ? (
                  <div className="flex justify-between text-zinc-600">
                    <span>Returned</span>
                    <span>−{peso(sale.refundedAmount)}</span>
                  </div>
                ) : null}
                <hr className="my-2.5 border-dashed border-zinc-500" />
                <div className="flex justify-between text-base font-bold">
                  <span>TOTAL</span>
                  <span>{peso(sale.total - (sale.refundedAmount || 0))}</span>
                </div>
                <p className="mt-3 text-center text-[11px] text-zinc-500">{inv.settings.slipFooter}</p>
              </>
            ) : (
              <p className="font-sans text-muted">Complete a sale to see its itemized slip here.</p>
            )}
          </div>
        </Panel>

        <Panel title="Recent sales">
          {recent.length ? (
            recent.map((s) => (
              <div key={s.id} className="flex items-center gap-2 border-t border-border px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setLastSale(s.id)}
                  className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-accent-soft ${sale?.id === s.id ? "bg-accent-soft" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">
                      #{s.id} · {fmtTime(s.time)}
                    </span>
                    <span className="text-xs text-muted">
                      {s.payment === "utang" ? `Utang · ${s.customerName}` : "Cash"}
                      {s.status !== "complete" ? " · returned" : ""}
                    </span>
                  </span>
                  <strong className="tabular-nums">{peso(s.total - (s.refundedAmount || 0))}</strong>
                </button>
                {s.status !== "returned" ? (
                  <Button variant="ghost" size="icon-sm" title="Wrong order" aria-label="Wrong order" onClick={() => setReturnSale(s)}>
                    <Undo2 className="size-4" />
                  </Button>
                ) : (
                  <Badge tone="neutral">Returned</Badge>
                )}
              </div>
            ))
          ) : (
            <Empty title="No sales yet" body="Sales you complete will be listed here." />
          )}
        </Panel>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        total={totalCents / 100}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={(opts) => {
          mutate((eng) => {
            const r = eng.sell(
              lines.map((l) => ({ sku: l.sku, qty: l.qty })),
              opts,
            );
            if (!r.ok) {
              toast.error(r.error);
              return;
            }
            setCart([]);
            setLastSale(r.sale.id);
            setCheckoutOpen(false);
            toast.success(
              r.sale.payment === "utang"
                ? `Sale #${r.sale.id} on utang for ${r.sale.customerName}: ${peso(r.sale.total)}`
                : `Sale #${r.sale.id} complete (cash): ${peso(r.sale.total)}`,
            );
          });
        }}
      />
      <ReturnDialog sale={returnSale} onClose={() => setReturnSale(null)} />
    </div>
  );
}

function CheckoutDialog({
  open,
  total,
  onClose,
  onConfirm,
}: {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (opts: {
    payment: PaymentMethod;
    customerName?: string;
    customerId?: number;
    customerPhone?: string;
    dueDate?: string;
  }) => void;
}) {
  const revision = useApp((s) => s.revision);
  void revision;
  const inv = getEngine();
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [customerId, setCustomerId] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [phone, setPhone] = useState("");
  const [due, setDue] = useState(Dates.addDays(inv.today(), inv.settings.defaultDebtDays));

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
        else {
          setPayment("cash");
          setCustomerId("");
          setNewName("");
          setPhone("");
          setDue(Dates.addDays(inv.today(), inv.settings.defaultDebtDays));
        }
      }}
    >
      <DialogContent title="How is this paid?" description={`Total ${peso(total)}. Choose cash or utang before the sale is recorded.`}>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPayment("cash")}
            className={`rounded-xl border px-4 py-3 text-left ${payment === "cash" ? "border-accent bg-accent-soft" : "border-border"}`}
          >
            <strong className="block">Cash</strong>
            <span className="text-sm text-muted">Paid now, added to earned money.</span>
          </button>
          <button
            type="button"
            onClick={() => setPayment("utang")}
            className={`rounded-xl border px-4 py-3 text-left ${payment === "utang" ? "border-accent bg-accent-soft" : "border-border"}`}
          >
            <strong className="block">Utang</strong>
            <span className="text-sm text-muted">On account, due on a deadline.</span>
          </button>
        </div>
        {payment === "utang" ? (
          <div className="mt-4 grid gap-3">
            <Field label="Existing customer">
              <select
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">New customer…</option>
                {inv.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {inv.customerBalance(c.id) ? ` · ${peso(inv.customerBalance(c.id))} open` : ""}
                  </option>
                ))}
              </select>
            </Field>
            {!customerId ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Customer name">
                  <Input required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Aling Rosa" />
                </Field>
                <Field label="Phone (optional)">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
              </div>
            ) : null}
            <Field label="Due date">
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </Field>
          </div>
        ) : null}
        <DialogActions>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (payment === "utang" && !customerId && !newName.trim()) {
                toast.error("Enter the customer’s name for utang.");
                return;
              }
              onConfirm({
                payment,
                customerId: customerId ? Number(customerId) : undefined,
                customerName: newName,
                customerPhone: phone,
                dueDate: due,
              });
            }}
          >
            Record {payment === "cash" ? "cash" : "utang"} sale
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

function ReturnDialog({ sale, onClose }: { sale: Sale | null; onClose: () => void }) {
  const mutate = useApp((s) => s.mutate);
  const inv = getEngine();
  const live = sale ? inv.sales.find((s) => s.id === sale.id) : null;
  const [qty, setQty] = useState<Record<string, number>>({});

  const open = !!live;
  const defaults = live
    ? Object.fromEntries(live.lines.map((l) => [l.sku, inv.remainingLineQty(live, l.sku)]))
    : {};

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
        else if (live) setQty(defaults);
      }}
    >
      <DialogContent
        title="Wrong order"
        description="The customer came back with the wrong items. Returned stock goes back on the shelf, cash is refunded, and utang is reduced."
      >
        {live ? (
          <div className="grid gap-3">
            {live.lines.map((l) => {
              const left = inv.remainingLineQty(live, l.sku);
              return (
                <div key={l.sku} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted">
                      Sold {l.qty}
                      {left < l.qty ? ` · ${l.qty - left} already returned` : ""}
                    </div>
                  </div>
                  <Field label="Return qty" className="w-24">
                    <Input
                      type="number"
                      min={0}
                      max={left}
                      step={1}
                      value={qty[l.sku] ?? left}
                      onChange={(e) => setQty({ ...qty, [l.sku]: Number(e.target.value) })}
                    />
                  </Field>
                </div>
              );
            })}
            <DialogActions>
              <Button variant="secondary" onClick={onClose}>
                Keep sale
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const items = live.lines
                    .map((l) => ({ sku: l.sku, qty: qty[l.sku] ?? inv.remainingLineQty(live, l.sku) }))
                    .filter((x) => x.qty > 0);
                  if (!items.length) {
                    toast.error("Choose at least one item to return.");
                    return;
                  }
                  mutate((eng) => {
                    const r = eng.returnSale(live.id, items);
                    if (!r.ok) {
                      toast.error(r.error);
                      return;
                    }
                    toast.success(`Returned ${peso(r.refund)} from sale #${live.id}.`);
                    onClose();
                  });
                }}
              >
                Record return
              </Button>
            </DialogActions>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
