import { MinHeap } from "./heap";
import {
  Dates,
  NO_EXPIRY,
  fail,
  normSku,
  parsePrice,
  parseQty,
  parseReorder,
  round2,
  toCents,
} from "./dates";
import type {
  Activity,
  Batch,
  CashEvent,
  Customer,
  Debt,
  ExpiryReport,
  FinanceSummary,
  InventoryState,
  PaymentMethod,
  Product,
  ProductRow,
  Pullout,
  Sale,
  SaleLine,
  Settings,
  Shortage,
  StockInfo,
} from "./types";
import { DEFAULT_SETTINGS } from "./types";

const expiryKey = (b: Batch) => b.expiry_date || NO_EXPIRY;
export function batchCmp(x: Batch, y: Batch) {
  const kx = expiryKey(x);
  const ky = expiryKey(y);
  if (kx < ky) return -1;
  if (kx > ky) return 1;
  return x.id - y.id;
}

function refreshDebtStatus(d: Debt, today: string): Debt["status"] {
  if (d.status === "cancelled") return "cancelled";
  if (d.remaining <= 0) return "paid";
  if (d.dueDate <= today) return "overdue";
  return "open";
}

export class Inventory {
  clock: () => string;
  defaultReorder: number;
  products = new Map<string, Product>();
  heaps = new Map<string, MinHeap<Batch>>();
  sales: Sale[] = [];
  activity: Activity[] = [];
  settings: Settings = { ...DEFAULT_SETTINGS };
  customers: Customer[] = [];
  debts: Debt[] = [];
  pullouts: Pullout[] = [];
  cashEvents: CashEvent[] = [];
  nextBatchId = 1;
  nextSaleId = 1;
  nextCustomerId = 1;
  nextDebtId = 1;
  nextPaymentId = 1;
  nextPulloutId = 1;
  nextCashId = 1;

  constructor(opts: { clock?: () => string; defaultReorder?: number } = {}) {
    this.clock = opts.clock || (() => Dates.todayStr());
    this.defaultReorder = opts.defaultReorder ?? 5;
  }

  today() {
    return this.clock();
  }
  isExpired(batch: Batch) {
    return !!batch.expiry_date && batch.expiry_date < this.today();
  }

  log(message: string) {
    this.activity.unshift({ message, time: new Date().toISOString() });
    if (this.activity.length > 40) this.activity.length = 40;
  }

  _reset() {
    this.products.clear();
    this.heaps.clear();
    this.sales = [];
    this.activity = [];
    this.customers = [];
    this.debts = [];
    this.pullouts = [];
    this.cashEvents = [];
    this.nextBatchId = 1;
    this.nextSaleId = 1;
    this.nextCustomerId = 1;
    this.nextDebtId = 1;
    this.nextPaymentId = 1;
    this.nextPulloutId = 1;
    this.nextCashId = 1;
  }

  getProduct(sku: string) {
    return this.products.get(normSku(sku));
  }

  addProduct(p: { sku?: unknown; name?: unknown; price?: unknown; cost?: unknown; reorder_level?: unknown; category?: unknown }) {
    const sku = normSku(p.sku);
    const name = String(p.name ?? "").trim();
    const category = String(p.category ?? "").trim() || "Uncategorized";
    const price = parsePrice(p.price);
    const costRaw = p.cost === "" || p.cost == null ? 0 : parsePrice(p.cost);
    const reorder = parseReorder(p.reorder_level, this.defaultReorder);
    if (!sku) return fail("SKU is required.");
    if (this.products.has(sku)) return fail(`SKU ${sku} already exists.`);
    if (!name) return fail("Product name is required.");
    if (price === null) return fail("Price must be a number, 0 or higher.");
    if (costRaw === null) return fail("Cost must be a number, 0 or higher.");
    if (reorder === null) return fail("Reorder level must be a whole number, 0 or higher.");
    const product: Product = { sku, name, category, price, cost: costRaw, reorder_level: reorder };
    this.products.set(sku, product);
    this.heaps.set(sku, new MinHeap(batchCmp));
    this.log(`Added product ${name}.`);
    return { ok: true as const, product };
  }

  updateProduct(sku: string, f: Partial<{ name: string; category: string; price: unknown; cost: unknown; reorder_level: unknown }>) {
    const p = this.getProduct(sku);
    if (!p) return fail("Product not found.");
    const next: Partial<Product> = {};
    if (f.name !== undefined) {
      next.name = String(f.name).trim();
      if (!next.name) return fail("Product name is required.");
    }
    if (f.category !== undefined) next.category = String(f.category).trim() || "Uncategorized";
    if (f.price !== undefined) {
      const price = parsePrice(f.price);
      if (price === null) return fail("Price must be a number, 0 or higher.");
      next.price = price;
    }
    if (f.cost !== undefined) {
      const cost = f.cost === "" || f.cost == null ? 0 : parsePrice(f.cost);
      if (cost === null) return fail("Cost must be a number, 0 or higher.");
      next.cost = cost;
    }
    if (f.reorder_level !== undefined) {
      const reorder = parseReorder(f.reorder_level, this.defaultReorder);
      if (reorder === null) return fail("Reorder level must be a whole number, 0 or higher.");
      next.reorder_level = reorder;
    }
    Object.assign(p, next);
    this.log(`Updated ${p.name}.`);
    return { ok: true as const, product: p };
  }

  removeProduct(sku: string) {
    const p = this.getProduct(sku);
    if (!p) return fail("Product not found.");
    this.products.delete(p.sku);
    this.heaps.delete(p.sku);
    this.log(`Removed product ${p.name}.`);
    return { ok: true as const };
  }

  categories() {
    return [...new Set([...this.products.values()].map((p) => p.category))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  checkBatch(qty: unknown, expiry: unknown) {
    const q = Number(qty);
    if (qty === "" || qty == null || !Number.isInteger(q) || q <= 0) {
      return fail("Quantity must be a whole number greater than 0.");
    }
    const exp = expiry ? String(expiry).trim() : "";
    if (exp && !Dates.isValid(exp)) return fail("Expiry date must be a valid date.");
    return { ok: true as const, qty: q, expiry: exp || null };
  }

  addBatch(sku: string, qty: unknown, expiry?: unknown, receivedDate?: string) {
    const p = this.getProduct(sku);
    if (!p) return fail("Product not found.");
    const c = this.checkBatch(qty, expiry);
    if (!c.ok) return c;
    const batch: Batch = {
      id: this.nextBatchId++,
      sku: p.sku,
      qty: c.qty,
      expiry_date: c.expiry,
      received_date: receivedDate || this.today(),
    };
    this.heaps.get(p.sku)!.push(batch);
    this.log(`Received ${c.qty} × ${p.name}.`);
    return { ok: true as const, batch };
  }

  removeBatch(sku: string, batchId: number) {
    const p = this.getProduct(sku);
    if (!p) return fail("Product not found.");
    const heap = this.heaps.get(p.sku)!;
    const batch = heap.toArray().find((b) => b.id === batchId);
    if (!batch) return fail("Batch not found.");
    heap.removeWhere((b) => b.id === batchId);
    this.log(`Removed a batch of ${batch.qty} × ${p.name}.`);
    return { ok: true as const, batch };
  }

  batchesOf(sku: string) {
    const heap = this.heaps.get(normSku(sku));
    return heap ? heap.toArray().sort(batchCmp) : [];
  }

  stockInfo(sku: string): StockInfo | null {
    const p = this.getProduct(sku);
    const heap = p && this.heaps.get(p.sku);
    if (!heap || !p) return null;
    let total = 0;
    let sellable = 0;
    let expired = 0;
    let nextExpiry: string | null = null;
    heap.forEach((b) => {
      total += b.qty;
      if (this.isExpired(b)) expired += b.qty;
      else {
        sellable += b.qty;
        if (b.expiry_date && (nextExpiry === null || b.expiry_date < nextExpiry)) nextExpiry = b.expiry_date;
      }
    });
    const status = sellable === 0 ? "out" : sellable <= p.reorder_level ? "low" : "ok";
    return { total, sellable, expired, nextExpiry, status, batches: heap.size() };
  }

  listProducts(filters: { q?: string; category?: string; status?: string } = {}): ProductRow[] {
    const q = (filters.q || "").trim().toLowerCase();
    const out: ProductRow[] = [];
    for (const p of this.products.values()) {
      if (filters.category && p.category !== filters.category) continue;
      if (
        q &&
        !(
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      )
        continue;
      const info = this.stockInfo(p.sku);
      if (!info) continue;
      if (filters.status && info.status !== filters.status) continue;
      out.push({ product: p, info });
    }
    return out;
  }

  reorderList() {
    return this.listProducts()
      .filter((r) => r.info.status !== "ok")
      .sort((a, b) =>
        a.info.status === b.info.status
          ? a.info.sellable - b.info.sellable
          : a.info.status === "out"
            ? -1
            : 1,
      );
  }

  addCustomer(input: { name: string; phone?: string; notes?: string }) {
    const name = String(input.name || "").trim();
    if (!name) return fail("Customer name is required.");
    const existing = this.customers.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return { ok: true as const, customer: existing, created: false };
    const customer: Customer = {
      id: this.nextCustomerId++,
      name,
      phone: String(input.phone || "").trim(),
      notes: String(input.notes || "").trim(),
    };
    this.customers.push(customer);
    this.log(`Added customer ${name}.`);
    return { ok: true as const, customer, created: true };
  }

  getCustomer(id: number) {
    return this.customers.find((c) => c.id === id);
  }

  customerBalance(id: number) {
    return this.debts
      .filter((d) => d.customerId === id && d.remaining > 0 && d.status !== "cancelled")
      .reduce((s, d) => s + d.remaining, 0);
  }

  sell(
    items: { sku: string; qty: number }[],
    opts: {
      payment: PaymentMethod;
      customerName?: string;
      customerId?: number;
      customerPhone?: string;
      dueDate?: string;
    },
  ) {
    if (!Array.isArray(items) || items.length === 0) return fail("The cart is empty.");
    if (opts.payment !== "cash" && opts.payment !== "utang") return fail("Choose cash or utang.");

    const need = new Map<string, number>();
    for (const it of items) {
      const sku = normSku(it.sku);
      const q = Number(it.qty);
      if (!this.products.has(sku)) return fail(`Unknown SKU: ${sku}.`);
      if (!Number.isInteger(q) || q <= 0) return fail(`Invalid quantity for ${sku}.`);
      need.set(sku, (need.get(sku) || 0) + q);
    }

    const shortages: Shortage[] = [];
    for (const [sku, q] of need) {
      const info = this.stockInfo(sku)!;
      if (info.sellable < q) {
        shortages.push({
          sku,
          name: this.products.get(sku)!.name,
          requested: q,
          available: info.sellable,
          expired: info.expired,
        });
      }
    }
    if (shortages.length) {
      const msg = shortages
        .map(
          (s) =>
            `${s.name}: need ${s.requested}, only ${s.available} sellable` +
            (s.expired ? ` (${s.expired} expired can't be sold)` : "") +
            ".",
        )
        .join(" ");
      return { ok: false as const, error: msg, shortages };
    }

    let customer: Customer | undefined;
    let dueDate: string | undefined;
    if (opts.payment === "utang") {
      if (opts.customerId) customer = this.getCustomer(opts.customerId);
      if (!customer) {
        const added = this.addCustomer({
          name: opts.customerName || "",
          phone: opts.customerPhone,
        });
        if (!added.ok) return added;
        customer = added.customer;
      }
      dueDate = opts.dueDate || Dates.addDays(this.today(), this.settings.defaultDebtDays);
      if (!Dates.isValid(dueDate)) return fail("Due date must be a valid date.");
    }

    const lines: SaleLine[] = [];
    let totalCents = 0;
    for (const [sku, q] of need) {
      const p = this.products.get(sku)!;
      const heap = this.heaps.get(sku)!;
      const stash: Batch[] = [];
      const taken: SaleLine["batches"] = [];
      let left = q;
      while (left > 0 && !heap.isEmpty()) {
        const top = heap.peek()!;
        if (this.isExpired(top)) {
          stash.push(heap.pop()!);
          continue;
        }
        const take = Math.min(top.qty, left);
        top.qty -= take;
        left -= take;
        taken.push({ batch_id: top.id, expiry_date: top.expiry_date, qty: take });
        if (top.qty === 0) heap.pop();
      }
      stash.forEach((b) => heap.push(b));
      const amountCents = toCents(p.price) * q;
      totalCents += amountCents;
      lines.push({
        sku,
        name: p.name,
        qty: q,
        price: p.price,
        cost: p.cost,
        amount: amountCents / 100,
        batches: taken,
      });
    }

    const sale: Sale = {
      id: this.nextSaleId++,
      time: new Date().toISOString(),
      date: this.today(),
      lines,
      total: totalCents / 100,
      payment: opts.payment,
      customerId: customer?.id,
      customerName: customer?.name,
      status: "complete",
      returns: [],
      refundedAmount: 0,
    };

    if (opts.payment === "cash") {
      this.cashEvents.push({
        id: this.nextCashId++,
        type: "sale_cash",
        amount: sale.total,
        time: sale.time,
        date: sale.date,
        note: `Sale #${sale.id}`,
        ref: `sale:${sale.id}`,
      });
    } else if (customer && dueDate) {
      const debt: Debt = {
        id: this.nextDebtId++,
        customerId: customer.id,
        customerName: customer.name,
        saleId: sale.id,
        amount: sale.total,
        remaining: sale.total,
        dueDate,
        createdAt: sale.time,
        status: refreshDebtStatus(
          {
            id: 0,
            customerId: customer.id,
            customerName: customer.name,
            saleId: sale.id,
            amount: sale.total,
            remaining: sale.total,
            dueDate,
            createdAt: sale.time,
            status: "open",
            payments: [],
          },
          this.today(),
        ),
        payments: [],
      };
      this.debts.push(debt);
      sale.debtId = debt.id;
    }

    this.sales.push(sale);
    if (this.sales.length > 400) this.sales.shift();
    const payLabel = opts.payment === "cash" ? "cash" : `utang (${customer!.name})`;
    this.log(`Sale #${sale.id}: ${lines.reduce((s, l) => s + l.qty, 0)} item(s), ${payLabel}.`);
    return { ok: true as const, sale };
  }

  remainingLineQty(sale: Sale, sku: string) {
    const line = sale.lines.find((l) => l.sku === sku);
    if (!line) return 0;
    const ret = sale.returns.filter((r) => r.sku === sku).reduce((s, r) => s + r.qty, 0);
    return line.qty - ret;
  }

  returnSale(saleId: number, items: { sku: string; qty: number }[]) {
    const sale = this.sales.find((s) => s.id === saleId);
    if (!sale) return fail("Sale not found.");
    if (sale.status === "returned") return fail("This sale was already fully returned.");
    if (!items.length) return fail("Choose items to return.");

    const want = new Map<string, number>();
    for (const it of items) {
      const sku = normSku(it.sku);
      const q = parseQty(it.qty);
      if (!q) return fail("Return quantity must be a whole number greater than 0.");
      want.set(sku, (want.get(sku) || 0) + q);
    }

    let refundCents = 0;
    for (const [sku, q] of want) {
      const line = sale.lines.find((l) => l.sku === sku);
      if (!line) return fail(`SKU ${sku} was not on this sale.`);
      const left = this.remainingLineQty(sale, sku);
      if (q > left) return fail(`${line.name}: only ${left} left to return.`);
      refundCents += toCents(line.price) * q;
    }

    for (const [sku, q] of want) {
      const line = sale.lines.find((l) => l.sku === sku)!;
      let left = q;
      const restored: { expiry: string | null; qty: number }[] = [];
      for (let i = line.batches.length - 1; i >= 0 && left > 0; i--) {
        const take = line.batches[i]!;
        const give = Math.min(take.qty, left);
        if (give <= 0) continue;
        restored.push({ expiry: take.expiry_date, qty: give });
        take.qty -= give;
        left -= give;
      }
      if (left > 0) restored.push({ expiry: null, qty: left });
      const heap = this.heaps.get(sku);
      if (heap) {
        for (const r of restored) {
          const existing = heap.toArray().find((b) => b.expiry_date === r.expiry);
          if (existing) existing.qty += r.qty;
          else {
            heap.push({
              id: this.nextBatchId++,
              sku,
              qty: r.qty,
              expiry_date: r.expiry,
              received_date: this.today(),
            });
          }
        }
      }
      const amount = (toCents(line.price) * q) / 100;
      sale.returns.push({ sku, qty: q, amount, time: new Date().toISOString() });
    }

    sale.refundedAmount = round2(sale.refundedAmount + refundCents / 100);
    const fully = sale.lines.every((l) => this.remainingLineQty(sale, l.sku) === 0);
    sale.status = fully ? "returned" : "partial_return";

    const refund = refundCents / 100;
    if (sale.payment === "cash") {
      this.cashEvents.push({
        id: this.nextCashId++,
        type: "refund",
        amount: -refund,
        time: new Date().toISOString(),
        date: this.today(),
        note: `Wrong order, sale #${sale.id}`,
        ref: `sale:${sale.id}`,
      });
    } else if (sale.debtId) {
      const debt = this.debts.find((d) => d.id === sale.debtId);
      if (debt) {
        const paid = (debt.payments || []).reduce((s, p) => s + p.amount, 0);
        const newAmount = round2(Math.max(0, debt.amount - refund));
        debt.amount = newAmount;
        if (paid > newAmount) {
          const extra = round2(paid - newAmount);
          this.cashEvents.push({
            id: this.nextCashId++,
            type: "refund",
            amount: -extra,
            time: new Date().toISOString(),
            date: this.today(),
            note: `Utang overpay refund, sale #${sale.id}`,
            ref: `debt:${debt.id}`,
          });
          debt.remaining = 0;
        } else {
          debt.remaining = round2(newAmount - paid);
        }
        if (fully && debt.remaining === 0 && paid === 0) debt.status = "cancelled";
        else debt.status = refreshDebtStatus(debt, this.today());
      }
    }

    this.log(
      `Wrong order on sale #${sale.id}: returned ${[...want.values()].reduce((s, n) => s + n, 0)} pc(s).`,
    );
    return { ok: true as const, sale, refund };
  }

  payDebt(debtId: number, amount: unknown) {
    const debt = this.debts.find((d) => d.id === debtId);
    if (!debt) return fail("Utang record not found.");
    if (debt.status === "cancelled") return fail("This utang was cancelled.");
    if (debt.remaining <= 0) return fail("This utang is already paid.");
    const n = parsePrice(amount);
    if (n === null || n <= 0) return fail("Payment must be greater than 0.");
    const pay = Math.min(n, debt.remaining);
    debt.remaining = round2(debt.remaining - pay);
    debt.payments.push({
      id: this.nextPaymentId++,
      amount: pay,
      time: new Date().toISOString(),
      note: "Collection",
    });
    debt.status = refreshDebtStatus(debt, this.today());
    this.cashEvents.push({
      id: this.nextCashId++,
      type: "debt_pay",
      amount: pay,
      time: new Date().toISOString(),
      date: this.today(),
      note: `Utang payment from ${debt.customerName}`,
      ref: `debt:${debt.id}`,
    });
    this.log(`Collected ${pay.toFixed(2)} from ${debt.customerName}.`);
    return { ok: true as const, debt, paid: pay };
  }

  expiryReport(days = 14): ExpiryReport {
    const all: Batch[] = [];
    for (const heap of this.heaps.values()) heap.forEach((b) => { if (b.expiry_date) all.push(b); });
    const heap = MinHeap.from(all, batchCmp);
    const today = this.today();
    const expired: ExpiryReport["expired"] = [];
    const soon: ExpiryReport["soon"] = [];
    while (!heap.isEmpty()) {
      const b = heap.peek()!;
      const daysLeft = Dates.daysBetween(today, b.expiry_date!);
      if (daysLeft > days) break;
      heap.pop();
      const product = this.products.get(b.sku)!;
      const row = { batch: b, product, daysLeft, value: round2(b.qty * product.price) };
      (daysLeft < 0 ? expired : soon).push(row);
    }
    return { expired, soon, examined: all.length };
  }

  pullOutExpired() {
    const items: Pullout["items"] = [];
    let batches = 0;
    let qty = 0;
    let lossCents = 0;
    for (const [sku, heap] of this.heaps) {
      const p = this.products.get(sku)!;
      while (!heap.isEmpty() && this.isExpired(heap.peek()!)) {
        const b = heap.pop()!;
        batches++;
        qty += b.qty;
        const value = (toCents(p.price) * b.qty) / 100;
        lossCents += toCents(p.price) * b.qty;
        items.push({ sku, name: p.name, qty: b.qty, expiry_date: b.expiry_date, value });
      }
    }
    const loss = lossCents / 100;
    if (batches) {
      const rec: Pullout = {
        id: this.nextPulloutId++,
        time: new Date().toISOString(),
        date: this.today(),
        batches,
        qty,
        loss,
        items,
      };
      this.pullouts.push(rec);
      this.log(`Pulled out ${batches} expired batch(es), ${qty} pcs.`);
    }
    return { ok: true as const, batches, qty, loss, items };
  }

  summary(report?: ExpiryReport) {
    const rep = report || this.expiryReport(this.settings.expiryWarningDays);
    let low = 0;
    let out = 0;
    let valueCents = 0;
    for (const p of this.products.values()) {
      const info = this.stockInfo(p.sku)!;
      if (info.status === "low") low++;
      else if (info.status === "out") out++;
      valueCents += toCents(p.price) * info.sellable;
    }
    return {
      products: this.products.size,
      low,
      out,
      inventoryValue: valueCents / 100,
      expiredBatches: rep.expired.length,
      expiredValue: round2(rep.expired.reduce((s, r) => s + r.value, 0)),
      soonBatches: rep.soon.length,
      openUtang: this.debts.filter((d) => d.remaining > 0 && d.status !== "cancelled").length,
    };
  }

  financeSummary(): FinanceSummary {
    let grossCents = 0;
    let cogsCents = 0;
    let cashSalesCents = 0;
    let utangSalesCents = 0;
    for (const s of this.sales) {
      for (const line of s.lines) {
        const ret = s.returns.filter((r) => r.sku === line.sku).reduce((a, r) => a + r.qty, 0);
        const q = line.qty - ret;
        if (q <= 0) continue;
        grossCents += toCents(line.price) * q;
        cogsCents += toCents(line.cost || 0) * q;
      }
      const net = toCents(s.total) - toCents(s.refundedAmount || 0);
      if (net > 0) {
        if (s.payment === "cash") cashSalesCents += net;
        else utangSalesCents += net;
      }
    }
    const earned = this.cashEvents.reduce((s, e) => s + e.amount, 0);
    const collections = this.cashEvents.filter((e) => e.type === "debt_pay").reduce((s, e) => s + e.amount, 0);
    const refunds = this.cashEvents.filter((e) => e.type === "refund").reduce((s, e) => s + Math.abs(e.amount), 0);
    const expiryLoss = round2(this.pullouts.reduce((s, p) => s + p.loss, 0));
    const openDebts = this.debts.filter((d) => d.remaining > 0 && d.status !== "cancelled");
    const today = this.today();
    const utangAssets = round2(openDebts.reduce((s, d) => s + d.remaining, 0));
    let inventoryRetail = 0;
    let inventoryCost = 0;
    for (const p of this.products.values()) {
      const info = this.stockInfo(p.sku)!;
      inventoryRetail += p.price * info.sellable;
      inventoryCost += (p.cost || 0) * info.sellable;
    }
    const grossSales = grossCents / 100;
    const cogs = cogsCents / 100;
    const profitGain = round2(grossSales - cogs - expiryLoss);
    return {
      earnedMoney: round2(earned),
      profitGain,
      grossSales: round2(grossSales),
      cogs: round2(cogs),
      expiryLoss,
      utangAssets,
      inventoryRetail: round2(inventoryRetail),
      inventoryCost: round2(inventoryCost),
      netWorth: round2(earned + utangAssets + inventoryCost),
      cashSales: cashSalesCents / 100,
      utangSales: utangSalesCents / 100,
      refunds: round2(refunds),
      collections: round2(collections),
      openDebts: openDebts.length,
      overdueDebts: openDebts.filter((d) => d.dueDate <= today).length,
    };
  }

  openDebts() {
    const today = this.today();
    return this.debts
      .map((d) => ({ ...d, status: refreshDebtStatus(d, today) }))
      .filter((d) => d.remaining > 0 && d.status !== "cancelled")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  toJSON(): InventoryState {
    const batches: Batch[] = [];
    for (const heap of this.heaps.values()) heap.forEach((b) => batches.push({ ...b }));
    return {
      format: "store-inventory-state",
      version: 3,
      saved_at: new Date().toISOString(),
      settings: { ...this.settings },
      nextBatchId: this.nextBatchId,
      nextSaleId: this.nextSaleId,
      nextCustomerId: this.nextCustomerId,
      nextDebtId: this.nextDebtId,
      nextPaymentId: this.nextPaymentId,
      nextPulloutId: this.nextPulloutId,
      nextCashId: this.nextCashId,
      products: [...this.products.values()].map((p) => ({ ...p })),
      batches,
      sales: this.sales,
      activity: this.activity,
      customers: this.customers,
      debts: this.debts,
      pullouts: this.pullouts,
      cashEvents: this.cashEvents,
    };
  }

  load(obj: InventoryState) {
    if (!obj || obj.format !== "store-inventory-state" || !Array.isArray(obj.products) || !Array.isArray(obj.batches)) {
      throw new Error("This is not a saved inventory file.");
    }
    this._reset();
    if (obj.settings && typeof obj.settings === "object") {
      this.settings = { ...DEFAULT_SETTINGS, ...obj.settings };
    }
    for (const p of obj.products) this.addProduct(p);
    let maxId = 0;
    for (const b of obj.batches) {
      const heap = this.heaps.get(normSku(b.sku));
      const c = this.checkBatch(b.qty, b.expiry_date);
      if (!heap || !c.ok || !Number.isInteger(b.id)) continue;
      heap.push({
        id: b.id,
        sku: normSku(b.sku),
        qty: c.qty,
        expiry_date: c.expiry,
        received_date: b.received_date || this.today(),
      });
      maxId = Math.max(maxId, b.id);
    }
    this.sales = Array.isArray(obj.sales) ? obj.sales.map(normalizeSale) : [];
    this.activity = Array.isArray(obj.activity) ? obj.activity : [];
    this.customers = Array.isArray(obj.customers) ? obj.customers : [];
    this.debts = Array.isArray(obj.debts) ? obj.debts : [];
    this.pullouts = Array.isArray(obj.pullouts) ? obj.pullouts : [];
    this.cashEvents = Array.isArray(obj.cashEvents) ? obj.cashEvents : [];
    this.nextBatchId = Math.max(Number(obj.nextBatchId) || 1, maxId + 1);
    const maxSale = this.sales.reduce((m, s) => Math.max(m, s.id || 0), 0);
    this.nextSaleId = Math.max(Number(obj.nextSaleId) || 1, maxSale + 1);
    this.nextCustomerId = Math.max(
      Number(obj.nextCustomerId) || 1,
      this.customers.reduce((m, c) => Math.max(m, c.id), 0) + 1,
    );
    this.nextDebtId = Math.max(Number(obj.nextDebtId) || 1, this.debts.reduce((m, d) => Math.max(m, d.id), 0) + 1);
    this.nextPaymentId = Math.max(
      Number(obj.nextPaymentId) || 1,
      this.debts.reduce((m, d) => Math.max(m, ...(d.payments || []).map((p) => p.id), 0), 0) + 1,
    );
    this.nextPulloutId = Math.max(
      Number(obj.nextPulloutId) || 1,
      this.pullouts.reduce((m, p) => Math.max(m, p.id), 0) + 1,
    );
    this.nextCashId = Math.max(
      Number(obj.nextCashId) || 1,
      this.cashEvents.reduce((m, e) => Math.max(m, e.id), 0) + 1,
    );
  }

  importSeed(seed: { products: Array<Partial<Product> & { sku: string; batches?: Array<{ qty: number; expiry_in_days?: number; expiry_date?: string }> }> }) {
    if (!seed || !Array.isArray(seed.products)) throw new Error('The file needs a "products" list.');
    this._reset();
    const today = this.today();
    const errors: string[] = [];
    for (const sp of seed.products) {
      const r = this.addProduct(sp);
      if (!r.ok) {
        errors.push(`${sp.sku}: ${r.error}`);
        continue;
      }
      for (const b of sp.batches || []) {
        const exp =
          b.expiry_in_days != null
            ? Dates.addDays(today, Number(b.expiry_in_days))
            : b.expiry_date || null;
        const rb = this.addBatch(r.product.sku, b.qty, exp);
        if (!rb.ok) errors.push(`${sp.sku}: ${rb.error}`);
      }
    }
    this.activity = [];
    this.sales = [];
    this.log(`Loaded ${this.products.size} sample products.`);
    return { ok: true as const, added: this.products.size, errors };
  }

  importAny(obj: InventoryState | { products: InventoryState["products"] }) {
    if (obj && "format" in obj && obj.format === "store-inventory-state") {
      this.load(obj as InventoryState);
      return { ok: true as const, errors: [] as string[] };
    }
    return this.importSeed(obj as { products: Array<Partial<Product> & { sku: string }> });
  }
}

function normalizeSale(s: Sale): Sale {
  return {
    ...s,
    payment: s.payment === "utang" ? "utang" : "cash",
    status: s.status || "complete",
    returns: Array.isArray(s.returns) ? s.returns : [],
    refundedAmount: s.refundedAmount || 0,
    lines: (s.lines || []).map((l) => ({ ...l, cost: l.cost || 0, batches: l.batches || [] })),
  };
}
