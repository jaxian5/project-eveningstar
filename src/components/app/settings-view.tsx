import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { Dates } from "@/lib/store/dates";
import { getEngine, useApp } from "@/lib/store/app-store";

export function SettingsView() {
  const revision = useApp((s) => s.revision);
  const updateSettings = useApp((s) => s.updateSettings);
  const resetSample = useApp((s) => s.resetSample);
  const importData = useApp((s) => s.importData);
  void revision;
  const inv = getEngine();
  const s = inv.settings;
  const fileRef = useRef<HTMLInputElement>(null);

  function exportJSON() {
    const blob = new Blob([JSON.stringify(inv.toJSON(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tindahan-${Dates.todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="grid max-w-3xl gap-5">
      <Panel title="Store">
        <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
          <Field label="Store name">
            <Input value={s.storeName} onChange={(e) => updateSettings({ storeName: e.target.value })} />
          </Field>
          <Field label="Slip footer">
            <Input value={s.slipFooter} onChange={(e) => updateSettings({ slipFooter: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Notifications" subtitle="The bell in the header turns the bar on or off. Fine-tune what it watches here.">
        <div className="grid gap-4 px-5 pb-5">
          <Toggle
            label="Show notification bar"
            hint="Master switch, same as the bell."
            checked={s.notificationsEnabled}
            onChange={(v) => {
              useApp.getState().setNotifyOpen(v);
            }}
          />
          <Toggle
            label="Near expiration"
            hint={`Batches that expire within ${s.expiryWarningDays} days, plus already expired stock.`}
            checked={s.notifyExpiry}
            onChange={(v) => updateSettings({ notifyExpiry: v })}
          />
          <Field label="Warn this many days before expiry">
            <Input
              type="number"
              min={1}
              max={365}
              value={s.expiryWarningDays}
              onChange={(e) => {
                let d = parseInt(e.target.value, 10);
                if (!Number.isInteger(d) || d < 1) d = 1;
                if (d > 365) d = 365;
                updateSettings({ expiryWarningDays: d });
              }}
            />
          </Field>
          <Toggle
            label="Low stock"
            hint="Fires when sellable quantity hits the product’s reorder level."
            checked={s.notifyLowStock}
            onChange={(v) => updateSettings({ notifyLowStock: v })}
          />
          <Toggle
            label="Utang / debts"
            hint="When a debt deadline is today or already past, and it is still unpaid."
            checked={s.notifyDebts}
            onChange={(v) => updateSettings({ notifyDebts: v })}
          />
          <Button
            variant="secondary"
            className="w-fit"
            onClick={() => {
              updateSettings({ dismissedIds: [] });
              toast.success("Dismissed notices will show again.");
            }}
          >
            Restore dismissed notices
          </Button>
        </div>
      </Panel>

      <Panel title="Utang defaults">
        <div className="px-5 pb-5">
          <Field label="Default due in (days)">
            <Input
              type="number"
              min={0}
              max={365}
              value={s.defaultDebtDays}
              onChange={(e) => updateSettings({ defaultDebtDays: Math.max(0, Number(e.target.value) || 0) })}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Data" subtitle="Everything is saved in this browser. Export a JSON backup before you reset.">
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          <Button variant="secondary" onClick={exportJSON}>Export JSON</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>Import JSON</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!confirm("Replace everything with the sample store? Current products, sales and utang will be lost.")) return;
              resetSample();
              toast.success("Sample data loaded.");
            }}
          >
            Reset sample data
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                const obj = JSON.parse(await file.text());
                if (!confirm("Importing replaces all products, batches, sales and utang in this browser. Continue?")) return;
                const r = importData(obj);
                toast.success(r.errors.length ? `Imported with ${r.errors.length} skipped row(s).` : "Data imported.");
              } catch {
                toast.error("That file isn’t valid JSON.");
              }
            }}
          />
        </div>
      </Panel>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <p className="text-sm text-muted">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
