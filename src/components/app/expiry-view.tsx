import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, Panel, StatCard } from "@/components/ui/panel";
import { dayLabel, fmtDate, peso } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";

export function ExpiryView() {
  const revision = useApp((s) => s.revision);
  const mutate = useApp((s) => s.mutate);
  const updateSettings = useApp((s) => s.updateSettings);
  void revision;
  const inv = getEngine();
  const days = inv.settings.expiryWarningDays;
  const report = inv.expiryReport(days);
  const lossValue = report.expired.reduce((s, r) => s + r.value, 0);
  const soonValue = report.soon.reduce((s, r) => s + r.value, 0);

  function row(r: (typeof report.expired)[number]) {
    return (
      <tr key={r.batch.id} className="border-t border-border">
        <td className="px-5 py-3 font-semibold">{r.product.name}</td>
        <td className="px-3 py-3 font-mono text-xs">{r.product.sku}</td>
        <td className="px-3 py-3 text-right tabular-nums">{r.batch.qty}</td>
        <td className="px-3 py-3">{fmtDate(r.batch.expiry_date!)}</td>
        <td className="px-3 py-3">
          <Badge tone={r.daysLeft < 0 ? "bad" : r.daysLeft <= days ? "warn" : "neutral"}>{dayLabel(r.daysLeft)}</Badge>
        </td>
        <td className="px-5 py-3 text-right tabular-nums">{peso(r.value)}</td>
      </tr>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Expired batches" value={report.expired.length} icon={<AlertTriangle className="size-4" />} tone="red" note="Cannot be sold" emphasis={report.expired.length > 0} />
        <StatCard label={`Expiring within ${days} days`} value={report.soon.length} icon={<Clock className="size-4" />} tone="amber" note={`${peso(soonValue)} at selling price`} />
        <StatCard label="Loss if pulled out today" value={peso(lossValue)} icon={<TrendingDown className="size-4" />} tone="red" note="At selling price, not cost" />
      </div>

      <Panel
        title="Expired stock"
        subtitle="Expired batches cannot be sold. Pull them out to clear the shelf and record the loss."
        actions={
          <Button
            variant="danger"
            disabled={!report.expired.length}
            onClick={() => {
              if (!confirm(`Pull out ${report.expired.length} expired batch(es)? They will be removed from stock.`)) return;
              mutate((eng) => {
                const r = eng.pullOutExpired();
                toast.success(`Pulled out ${r.qty} pcs. Estimated loss ${peso(r.loss)}.`);
              });
            }}
          >
            Pull out all expired
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-surface-2 text-left text-muted">
                <th className="px-5 py-2.5 font-medium">Product</th>
                <th className="px-3 py-2.5 font-medium">SKU</th>
                <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                <th className="px-3 py-2.5 font-medium">Expired on</th>
                <th className="px-3 py-2.5 font-medium">Overdue</th>
                <th className="px-5 py-2.5 text-right font-medium">Value at price</th>
              </tr>
            </thead>
            <tbody>{report.expired.map(row)}</tbody>
          </table>
          {report.expired.length === 0 ? <Empty title="Nothing has expired" body="Every batch on the shelf is still good." /> : null}
        </div>
      </Panel>

      <Panel
        title="Expiring soon"
        subtitle="Earliest first. Sell or discount these before the rest."
        actions={
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            Warn within
            <input
              type="number"
              min={1}
              max={365}
              step={1}
              className="h-10 w-[76px] rounded-lg border border-border bg-surface-2 px-2 text-fg"
              value={days}
              onChange={(e) => {
                let d = parseInt(e.target.value, 10);
                if (!Number.isInteger(d) || d < 1) d = 1;
                if (d > 365) d = 365;
                updateSettings({ expiryWarningDays: d });
              }}
            />
            days
          </label>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-surface-2 text-left text-muted">
                <th className="px-5 py-2.5 font-medium">Product</th>
                <th className="px-3 py-2.5 font-medium">SKU</th>
                <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                <th className="px-3 py-2.5 font-medium">Expires on</th>
                <th className="px-3 py-2.5 font-medium">Time left</th>
                <th className="px-5 py-2.5 text-right font-medium">Value at price</th>
              </tr>
            </thead>
            <tbody>{report.soon.map(row)}</tbody>
          </table>
          {report.soon.length === 0 ? <Empty title="Nothing expires soon" body="Try a longer warning window." /> : null}
        </div>
      </Panel>

      <p className="rounded-r-lg border-l-4 border-accent bg-surface px-4 py-3 text-sm text-muted">
        Near-expiration alerts start {days} days out (change this here or in Settings). Selling always takes the batch that expires first (FEFO). {report.examined} dated batches were checked; {report.expired.length + report.soon.length} sit inside the window.
      </p>
    </div>
  );
}
