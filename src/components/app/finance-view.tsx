import { useState } from "react";
import { Landmark, PiggyBank, Scale, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Empty, Panel, StatCard } from "@/components/ui/panel";
import { evaluate } from "@/lib/store/calculator";
import { fmtDate, peso } from "@/lib/store/format";
import { getEngine, useApp } from "@/lib/store/app-store";
import { cn } from "@/lib/cn";

export function FinanceView() {
  const revision = useApp((s) => s.revision);
  void revision;
  const inv = getEngine();
  const f = inv.financeSummary();
  const composition = [
    { name: "Cash collected", value: Math.max(0, f.earnedMoney), fill: "var(--accent)" },
    { name: "Utang (assets)", value: f.utangAssets, fill: "var(--info)" },
    { name: "Inventory at cost", value: f.inventoryCost, fill: "var(--ok)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Profit gain" value={peso(f.profitGain)} icon={<TrendingUp className="size-4" />} tone="green" note="Sales minus cost of goods and expiry losses" />
        <StatCard label="Net worth" value={peso(f.netWorth)} icon={<Scale className="size-4" />} tone="teal" note="Cash + open utang + inventory at cost" />
        <StatCard label="Net loss (expirations)" value={peso(f.expiryLoss)} icon={<TrendingDown className="size-4" />} tone="red" note={`${inv.pullouts.length} pull-out${inv.pullouts.length === 1 ? "" : "s"} recorded`} />
        <StatCard label="Assets (utang)" value={peso(f.utangAssets)} icon={<Wallet className="size-4" />} tone="amber" note={`${f.openDebts} open · ${f.overdueDebts} overdue`} />
        <StatCard label="Earned money" value={peso(f.earnedMoney)} icon={<PiggyBank className="size-4" />} note="Cash sales + collections − refunds" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel title="Overall summary" subtitle="Running picture of the till, not a BIR report.">
          <dl className="grid gap-0 text-sm">
            <Row k="Gross sales (after returns)" v={peso(f.grossSales)} />
            <Row k="Cash sales" v={peso(f.cashSales)} />
            <Row k="Utang sales" v={peso(f.utangSales)} />
            <Row k="Cost of goods sold" v={peso(f.cogs)} />
            <Row k="Collections on utang" v={peso(f.collections)} />
            <Row k="Refunds (wrong orders)" v={peso(f.refunds)} />
            <Row k="Expiry losses" v={peso(f.expiryLoss)} />
            <Row k="Inventory at selling price" v={peso(f.inventoryRetail)} />
            <Row k="Inventory at cost" v={peso(f.inventoryCost)} />
            <Row k="Profit gain" v={peso(f.profitGain)} strong />
            <Row k="Net worth" v={peso(f.netWorth)} strong />
          </dl>
          <p className="px-5 py-4 text-xs text-muted">
            Profit uses each product’s cost. Sample items are seeded at about 72% of selling price. Cash is running collections in this browser, not a bank balance.
          </p>
        </Panel>

        <Panel title="Where the money sits">
          {composition.length ? (
            <div className="h-[240px] px-2 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={composition} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                    {composition.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => peso(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty title="No balances yet" body="Complete a sale to see the mix." />
          )}
          <ul className="grid gap-1.5 px-5 pb-4 text-sm">
            {composition.map((d) => (
              <li key={d.name} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="tabular-nums">{peso(d.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Expiry losses" subtitle="Pull-outs of expired stock, valued at selling price.">
          {inv.pullouts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-surface-2 text-left text-muted">
                    <th className="px-5 py-2.5 font-medium">Date</th>
                    <th className="px-3 py-2.5 text-right font-medium">Batches</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-5 py-2.5 text-right font-medium">Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {[...inv.pullouts].reverse().map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-5 py-2.5">{fmtDate(p.date)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{p.batches}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{p.qty}</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">{peso(p.loss)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No expiry losses yet" body="Pull out expired batches from Expiry watch to record them here." />
          )}
        </Panel>
        <ShopCalculator />
      </div>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 border-t border-border px-5 py-2.5", strong && "bg-surface-2 font-semibold")}>
      <dt className={strong ? "text-fg" : "text-muted"}>{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}

function ShopCalculator() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("0");
  const [err, setErr] = useState("");

  function press(ch: string) {
    setErr("");
    if (ch === "C") {
      setExpr("");
      setOut("0");
      return;
    }
    if (ch === "⌫") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (ch === "=") {
      const r = evaluate(expr);
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      setOut(String(r.value));
      setExpr(String(r.value));
      return;
    }
    setExpr((e) => e + ch);
  }

  const keys = ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "(", "="];

  return (
    <Panel title="Calculator" subtitle="Percent works like a shop till: 200 + 10% = 220.">
      <div className="px-5 pb-5">
        <div className="mb-3 rounded-xl bg-ink px-4 py-3 text-right text-nav-ink">
          <div className="min-h-[1.25rem] truncate text-xs text-nav-muted">{expr || " "}</div>
          <div className="font-display text-3xl tabular-nums tracking-tight">{err || out}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((k) => (
            <Button
              key={k}
              variant={k === "=" ? "primary" : "secondary"}
              className={cn("h-11", k === "0" && "col-span-1")}
              onClick={() => press(k === "−" ? "-" : k === "×" ? "*" : k === "÷" ? "/" : k)}
            >
              {k}
            </Button>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <Landmark className="size-3.5" />
          Safe math — no eval(). Brackets and percents allowed.
        </p>
      </div>
    </Panel>
  );
}
