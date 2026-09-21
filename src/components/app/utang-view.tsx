import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogContent } from "@/components/ui/dialog";
import { Empty, Panel, StatCard } from "@/components/ui/panel";
import { Field, Input } from "@/components/ui/input";
import { fmtDate, peso } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";
import type { Debt } from "@/lib/store/types";
import { UserPlus, Wallet } from "lucide-react";

export function UtangView() {
  const revision = useApp((s) => s.revision);
  const mutate = useApp((s) => s.mutate);
  void revision;
  const inv = getEngine();
  const open = inv.openDebts();
  const today = inv.today();
  const overdue = open.filter((d) => d.dueDate <= today);
  const fin = inv.financeSummary();
  const [pay, setPay] = useState<Debt | null>(null);
  const [amount, setAmount] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open utang" value={open.length} icon={<Wallet className="size-4" />} note={`${peso(fin.utangAssets)} still collectible`} tone="teal" />
        <StatCard label="Overdue" value={overdue.length} icon={<Wallet className="size-4" />} tone="red" note="Deadline reached, still unpaid" emphasis={overdue.length > 0} />
        <StatCard label="Customers" value={inv.customers.length} icon={<UserPlus className="size-4" />} note="People with a store account" />
      </div>

      <Panel
        title="Open debts"
        subtitle="Utang from sales that have not been fully paid. Overdue rows need a collection or a return."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-surface-2 text-left text-muted">
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-3 py-2.5 font-medium">Sale</th>
                <th className="px-3 py-2.5 text-right font-medium">Original</th>
                <th className="px-3 py-2.5 text-right font-medium">Remaining</th>
                <th className="px-3 py-2.5 font-medium">Due</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {open.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{d.customerName}</div>
                    <div className="text-xs text-muted">{inv.getCustomer(d.customerId)?.phone || "No phone"}</div>
                  </td>
                  <td className="px-3 py-3">#{d.saleId}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{peso(d.amount)}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">{peso(d.remaining)}</td>
                  <td className="px-3 py-3">{fmtDate(d.dueDate)}</td>
                  <td className="px-3 py-3">
                    <Badge tone={d.status === "overdue" ? "bad" : "warn"}>{d.status === "overdue" ? "Overdue" : "Open"}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setPay(d);
                        setAmount(String(d.remaining));
                      }}
                    >
                      Collect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {open.length === 0 ? <Empty title="No open utang" body="Sales paid in cash, or fully collected debts, will not appear here." /> : null}
        </div>
      </Panel>

      <Panel
        title="Customers"
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-3.5" /> Add customer
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-surface-2 text-left text-muted">
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium">Phone</th>
                <th className="px-5 py-2.5 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {inv.customers.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-5 py-3 font-semibold">{c.name}</td>
                  <td className="px-3 py-3 text-muted">{c.phone || "—"}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{peso(inv.customerBalance(c.id))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {inv.customers.length === 0 ? <Empty title="No customers yet" body="Add someone here, or create them when recording an utang sale." /> : null}
        </div>
      </Panel>

      <Dialog open={!!pay} onOpenChange={(o) => !o && setPay(null)}>
        <DialogContent title={pay ? `Collect from ${pay.customerName}` : "Collect"} description={pay ? `Remaining ${peso(pay.remaining)}. Partial payments are allowed.` : undefined}>
          <Field label="Amount (PHP)">
            <Input type="number" min={0.01} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <DialogActions>
            <Button variant="secondary" onClick={() => setPay(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!pay) return;
                mutate((eng) => {
                  const r = eng.payDebt(pay.id, amount);
                  if (!r.ok) {
                    toast.error(r.error);
                    return;
                  }
                  toast.success(`Collected ${peso(r.paid)}.`);
                  setPay(null);
                });
              }}
            >
              Record payment
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent title="Add customer">
          <div className="grid gap-3">
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Phone (optional)">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
          </div>
          <DialogActions>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                mutate((eng) => {
                  const r = eng.addCustomer({ name, phone });
                  if (!r.ok) {
                    toast.error(r.error);
                    return;
                  }
                  toast.success(`${r.customer.name} saved.`);
                  setName("");
                  setPhone("");
                  setAddOpen(false);
                });
              }}
            >
              Save customer
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
