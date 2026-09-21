import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BillingView } from "@/components/app/billing-view";
import { ExpiryView } from "@/components/app/expiry-view";
import { FinanceView } from "@/components/app/finance-view";
import { InventoryView } from "@/components/app/inventory-view";
import { NotificationBar } from "@/components/app/notification-bar";
import { SettingsView } from "@/components/app/settings-view";
import { Shell } from "@/components/app/shell";
import { UtangView } from "@/components/app/utang-view";
import { useApp } from "@/lib/store/app-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const ready = useApp((s) => s.ready);
  const view = useApp((s) => s.view);
  const hydrate = useApp((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-muted">
        <p className="text-sm">Opening the ledger…</p>
      </div>
    );
  }

  return (
    <Shell>
      <NotificationBar />
      {view === "inventory" ? <InventoryView /> : null}
      {view === "billing" ? <BillingView /> : null}
      {view === "expiry" ? <ExpiryView /> : null}
      {view === "utang" ? <UtangView /> : null}
      {view === "finance" ? <FinanceView /> : null}
      {view === "settings" ? <SettingsView /> : null}
    </Shell>
  );
}
