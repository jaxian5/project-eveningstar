/*
 * inventory.js
 * ---------------------------------------------------------------
 * All business logic. No DOM code, so it can be unit-tested in Node.
 *
 * Data structures used
 *   products : Map<sku, product>          hash table -> O(1) lookup, unique SKUs
 *   heaps    : Map<sku, MinHeap<batch>>   one min-heap per SKU, keyed by expiry date
 *   utangs   : array of customer credit records
 *   losses   : cumulative expired pull-out losses (at selling price)
 *
 * A "batch" is one delivery of a product:
 *   { id, sku, qty, expiry_date: 'YYYY-MM-DD' | null, received_date }
 * A batch with no expiry date is treated as expiring on 9999-12-31, so it
 * always sorts last and never shows up in expiry reports.
 *
 * Rule: a batch is EXPIRED when expiry_date < today. It is still sellable on
 * its expiry date itself. Expired stock can never be sold; it must be pulled out.
 *
 * Extensions (v3):
 *   - Sales carry payment_mode: 'cash' | 'utang'
 *   - Utang records track customer credit with due dates
 *   - Refunds restock via FEFO-aware add-back and reverse money / utang
 *   - Finance summary: inventory value, cash intake, outstanding utang assets,
 *     expired losses, net position
 */
(function (root) {
  'use strict';

  const isNode = typeof module !== 'undefined' && module.exports && typeof require === 'function';
  const { MinHeap } = isNode ? require('./structures.js') : root.Structures;

  const NO_EXPIRY = '9999-12-31';
  const round2 = n => Math.round(n * 100) / 100;
  const toCents = n => Math.round(n * 100);          // money is summed in whole centavos
  const fail = error => ({ ok: false, error });
  const normSku = s => String(s == null ? '' : s).trim().toUpperCase();
  const normName = s => String(s == null ? '' : s).trim();

  /**
   * Category → SKU prefix (3 letters).
   * "Alcohol" → ALC, "Canned goods" → CAN, "Rice" → RIC
   */
  function categoryPrefix(category) {
    const raw = String(category == null ? '' : category).trim();
    if (!raw) return 'GEN';
    const letters = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (letters.length >= 3) return letters.slice(0, 3);
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      const initials = words.map(w => w[0].toUpperCase()).join('').replace(/[^A-Z0-9]/g, '');
      if (initials.length >= 3) return initials.slice(0, 3);
      return (initials + 'XXX').slice(0, 3);
    }
    return (letters + 'XXX').slice(0, 3);
  }

  // ---- date helpers (dates are 'YYYY-MM-DD' strings, compared as text) ----
  const Dates = {
    pad: n => String(n).padStart(2, '0'),
    todayStr(d = new Date()) {
      return `${d.getFullYear()}-${Dates.pad(d.getMonth() + 1)}-${Dates.pad(d.getDate())}`;
    },
    isValid(str) {
      if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
      const [y, m, d] = str.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
    },
    parse(str) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    /** whole days from `fromStr` to `toStr` (negative if toStr is earlier) */
    daysBetween(fromStr, toStr) {
      return Math.round((Dates.parse(toStr) - Dates.parse(fromStr)) / 86400000);
    },
    addDays(str, n) {
      const d = Dates.parse(str);
      d.setDate(d.getDate() + n);
      return Dates.todayStr(d);
    }
  };

  // ---- ordering of batches inside a heap: earliest expiry first, ties by id ----
  const expiryKey = b => b.expiry_date || NO_EXPIRY;
  function batchCmp(x, y) {
    const kx = expiryKey(x), ky = expiryKey(y);
    if (kx < ky) return -1;
    if (kx > ky) return 1;
    return x.id - y.id;
  }

  const parsePrice = v => {
    if (v === '' || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? round2(n) : null;
  };
  const parseReorder = (v, fallback) => {
    if (v === '' || v == null) return fallback;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 ? n : null;
  };

  class Inventory {
    /**
     * @param {{clock?:()=>string, defaultReorder?:number}} opts
     *   clock lets tests pretend it is another day.
     */
    constructor(opts = {}) {
      this.clock = opts.clock || (() => Dates.todayStr());
      this.defaultReorder = opts.defaultReorder != null ? opts.defaultReorder : 5;
      this.products = new Map();
      this.heaps = new Map();
      this.sales = [];
      this.activity = [];
      this.utangs = [];           // customer credit records
      this.losses = [];           // expired pull-out events { time, qty, loss, batches }
      this.financeReports = [];   // monthly snapshots for Compare
      this.settings = {};
      this.nextBatchId = 1;
      this.nextSaleId = 1;
      this.nextUtangId = 1;
      this.nextRefundId = 1;
    }

    today() { return this.clock(); }
    isExpired(batch) { return !!batch.expiry_date && batch.expiry_date < this.today(); }

    log(message) {
      this.activity.unshift({ message, time: new Date().toISOString() });
      if (this.activity.length > 20) this.activity.length = 20;
    }

    _reset() {
      this.products.clear();
      this.heaps.clear();
      this.sales = [];
      this.activity = [];
      this.utangs = [];
      this.losses = [];
      this.financeReports = [];
      this.nextBatchId = 1;
      this.nextSaleId = 1;
      this.nextUtangId = 1;
      this.nextRefundId = 1;
    }

    // ================= products (hash table) =================

    getProduct(sku) { return this.products.get(normSku(sku)); }               // O(1)

    addProduct(p) {                                                            // O(1) average
      const sku = normSku(p.sku);
      const name = String(p.name == null ? '' : p.name).trim();
      const category = String(p.category == null ? '' : p.category).trim() || 'Uncategorized';
      const price = parsePrice(p.price);
      const reorder = parseReorder(p.reorder_level, this.defaultReorder);
      if (!sku) return fail('SKU is required.');
      if (this.products.has(sku)) return fail(`SKU ${sku} already exists.`);
      if (!name) return fail('Product name is required.');
      if (price === null) return fail('Price must be a number, 0 or higher.');
      if (reorder === null) return fail('Reorder level must be a whole number, 0 or higher.');
      const product = { sku, name, category, price, reorder_level: reorder };
      this.products.set(sku, product);
      this.heaps.set(sku, new MinHeap(batchCmp));
      this.log(`Added product ${name}.`);
      return { ok: true, product };
    }

    updateProduct(sku, f) {
      const p = this.getProduct(sku);
      if (!p) return fail('Product not found.');
      const next = {};
      if (f.name !== undefined) {
        next.name = String(f.name).trim();
        if (!next.name) return fail('Product name is required.');
      }
      if (f.category !== undefined) next.category = String(f.category).trim() || 'Uncategorized';
      if (f.price !== undefined) {
        next.price = parsePrice(f.price);
        if (next.price === null) return fail('Price must be a number, 0 or higher.');
      }
      if (f.reorder_level !== undefined) {
        next.reorder_level = parseReorder(f.reorder_level, this.defaultReorder);
        if (next.reorder_level === null) return fail('Reorder level must be a whole number, 0 or higher.');
      }
      Object.assign(p, next);
      this.log(`Updated ${p.name}.`);
      return { ok: true, product: p };
    }

    removeProduct(sku) {
      const p = this.getProduct(sku);
      if (!p) return fail('Product not found.');
      this.products.delete(p.sku);
      this.heaps.delete(p.sku);
      this.log(`Removed product ${p.name}.`);
      return { ok: true };
    }

    categories() {
      return [...new Set([...this.products.values()].map(p => p.category))].sort((a, b) => a.localeCompare(b));
    }

    /** Build a 3-letter prefix from a category name. */
    categoryPrefix(category) {
      return categoryPrefix(category);
    }

    /**
     * Next SKU for a category: PREFIX-NNN where NNN is 1 + max existing for that prefix.
     * Example: Alcohol with ALC-123 present → ALC-124
     */
    nextSkuForCategory(category) {
      const prefix = categoryPrefix(category);
      let max = 0;
      const re = new RegExp(`^${prefix}-(\\d+)$`, 'i');
      for (const p of this.products.values()) {
        const m = String(p.sku).match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      }
      return `${prefix}-${String(max + 1).padStart(3, '0')}`;
    }

    // ================= batches (one min-heap per SKU) =================

    checkBatch(qty, expiry) {
      const q = Number(qty);
      if (qty === '' || qty == null || !Number.isInteger(q) || q <= 0) {
        return fail('Quantity must be a whole number greater than 0.');
      }
      const exp = expiry ? String(expiry).trim() : null;
      if (exp && !Dates.isValid(exp)) return fail('Expiry date must be a valid date.');
      return { ok: true, qty: q, expiry: exp || null };
    }

    addBatch(sku, qty, expiry, receivedDate) {                                 // O(log b)
      const p = this.getProduct(sku);
      if (!p) return fail('Product not found.');
      const c = this.checkBatch(qty, expiry);
      if (!c.ok) return c;
      const batch = {
        id: this.nextBatchId++, sku: p.sku, qty: c.qty,
        expiry_date: c.expiry, received_date: receivedDate || this.today()
      };
      this.heaps.get(p.sku).push(batch);
      this.log(`Received ${c.qty} x ${p.name}.`);
      return { ok: true, batch };
    }

    removeBatch(sku, batchId) {                                                // O(b)
      const p = this.getProduct(sku);
      if (!p) return fail('Product not found.');
      const heap = this.heaps.get(p.sku);
      const batch = heap.toArray().find(b => b.id === batchId);
      if (!batch) return fail('Batch not found.');
      heap.removeWhere(b => b.id === batchId);
      this.log(`Removed a batch of ${batch.qty} x ${p.name}.`);
      return { ok: true, batch };
    }

    /** All batches of one SKU, earliest expiry first. O(b log b) */
    batchesOf(sku) {
      const heap = this.heaps.get(normSku(sku));
      return heap ? heap.toArray().sort(batchCmp) : [];
    }

    /** Stock summary for one SKU. O(b) */
    stockInfo(sku) {
      const p = this.getProduct(sku);
      const heap = p && this.heaps.get(p.sku);
      if (!heap) return null;
      let total = 0, sellable = 0, expired = 0, nextExpiry = null;
      heap.forEach(b => {
        total += b.qty;
        if (this.isExpired(b)) expired += b.qty;
        else {
          sellable += b.qty;
          if (b.expiry_date && (nextExpiry === null || b.expiry_date < nextExpiry)) nextExpiry = b.expiry_date;
        }
      });
      const status = sellable === 0 ? 'out' : sellable <= p.reorder_level ? 'low' : 'ok';
      return { total, sellable, expired, nextExpiry, status, batches: heap.size() };
    }

    /** Filtered list for the inventory table. Linear scan, O(p * text length). */
    listProducts(filters = {}) {
      const q = (filters.q || '').trim().toLowerCase();
      const out = [];
      for (const p of this.products.values()) {
        if (filters.category && p.category !== filters.category) continue;
        if (q && !(p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
                   p.category.toLowerCase().includes(q))) continue;
        const info = this.stockInfo(p.sku);
        if (filters.status && info.status !== filters.status) continue;
        out.push({ product: p, info });
      }
      return out;
    }

    /** Products that need re-ordering (out first, then lowest stock). */
    reorderList() {
      return this.listProducts()
        .filter(r => r.info.status !== 'ok')
        .sort((a, b) => (a.info.status === b.info.status ? a.info.sellable - b.info.sellable
                                                          : a.info.status === 'out' ? -1 : 1));
    }

    // ================= selling (FEFO) =================

    /**
     * Sell items, always taking from the earliest-expiring, non-expired batch.
     * All-or-nothing: if any line is short, nothing is deducted.
     * @param {{sku:string, qty:number}[]} items
     * @param {{payment_mode?:'cash'|'utang', customer?:string, due_date?:string, note?:string}} opts
     */
    sell(items, opts = {}) {
      if (!Array.isArray(items) || items.length === 0) return fail('The cart is empty.');

      const payment_mode = opts.payment_mode === 'utang' ? 'utang' : 'cash';
      const customer = normName(opts.customer);
      const due_date = opts.due_date ? String(opts.due_date).trim() : null;
      const note = normName(opts.note);

      if (payment_mode === 'utang') {
        if (!customer) return fail('Customer name is required for utang.');
        if (due_date && !Dates.isValid(due_date)) return fail('Due date must be a valid date.');
      }

      // 1. merge duplicate lines and validate
      const need = new Map();
      for (const it of items) {
        const sku = normSku(it.sku);
        const q = Number(it.qty);
        if (!this.products.has(sku)) return fail(`Unknown SKU: ${sku}.`);
        if (!Number.isInteger(q) || q <= 0) return fail(`Invalid quantity for ${sku}.`);
        need.set(sku, (need.get(sku) || 0) + q);
      }

      // 2. check stock for every line BEFORE changing anything
      const shortages = [];
      for (const [sku, q] of need) {
        const info = this.stockInfo(sku);
        if (info.sellable < q) {
          shortages.push({ sku, name: this.products.get(sku).name, requested: q, available: info.sellable, expired: info.expired });
        }
      }
      if (shortages.length) {
        const msg = shortages.map(s =>
          `${s.name}: need ${s.requested}, only ${s.available} sellable` +
          (s.expired ? ` (${s.expired} expired can't be sold)` : '') + '.').join(' ');
        return { ok: false, error: msg, shortages };
      }

      // 3. commit: take from the top of each heap
      const lines = [];
      let totalCents = 0;
      for (const [sku, q] of need) {
        const p = this.products.get(sku);
        const heap = this.heaps.get(sku);
        const stash = [];      // expired batches sitting on top; put back afterwards
        const taken = [];
        let left = q;
        while (left > 0 && !heap.isEmpty()) {
          const top = heap.peek();
          if (this.isExpired(top)) { stash.push(heap.pop()); continue; }
          const take = Math.min(top.qty, left);
          top.qty -= take;                 // the expiry key is unchanged, so the heap stays valid
          left -= take;
          taken.push({ batch_id: top.id, expiry_date: top.expiry_date, qty: take });
          if (top.qty === 0) heap.pop();
        }
        stash.forEach(b => heap.push(b));
        const amountCents = toCents(p.price) * q;
        totalCents += amountCents;
        lines.push({ sku, name: p.name, qty: q, price: p.price, amount: amountCents / 100, batches: taken });
      }

      const sale = {
        id: this.nextSaleId++,
        time: new Date().toISOString(),
        date: this.today(),
        lines,
        total: totalCents / 100,
        payment_mode,
        customer: payment_mode === 'utang' ? customer : null,
        due_date: payment_mode === 'utang' ? (due_date || Dates.addDays(this.today(), 7)) : null,
        note: note || null,
        refunded: false,
        refund_ids: []
      };
      this.sales.push(sale);
      if (this.sales.length > 300) this.sales.shift();

      let utang = null;
      if (payment_mode === 'utang') {
        utang = {
          id: this.nextUtangId++,
          sale_id: sale.id,
          customer,
          amount: sale.total,
          remaining: sale.total,
          due_date: sale.due_date,
          created: this.today(),
          status: 'open',          // open | partial | paid
          payments: [],
          note: note || null
        };
        this.utangs.push(utang);
        this.log(`Sale #${sale.id} (utang) to ${customer}: ${lines.reduce((s, l) => s + l.qty, 0)} item(s).`);
      } else {
        this.log(`Sale #${sale.id} (cash): ${lines.reduce((s, l) => s + l.qty, 0)} item(s).`);
      }

      return { ok: true, sale, utang };
    }

    // ================= refunds / returns =================

    /**
     * Refund (full or partial) a previous sale.
     * Restocks the returned quantities as a new batch (no original expiry restored
     * unless the original batch expiry is still known and provided).
     * For utang sales, reduces remaining balance (or marks paid if fully covered).
     * @param {number} saleId
     * @param {{sku:string, qty:number}[]} items  // lines being returned
     * @param {{reason?:string, restock_expiry?:string}} opts
     */
    refund(saleId, items, opts = {}) {
      const sale = this.sales.find(s => s.id === Number(saleId));
      if (!sale) return fail('Sale not found.');
      if (sale.refunded) return fail('This sale was already fully refunded.');

      if (!Array.isArray(items) || items.length === 0) return fail('Select items to refund.');

      // Build how many of each SKU were originally sold and already refunded
      const original = new Map();
      for (const ln of sale.lines) original.set(ln.sku, (original.get(ln.sku) || 0) + ln.qty);

      // Track previous refunds against this sale
      const already = new Map();
      for (const rid of (sale.refund_ids || [])) {
        const prev = this.sales.find(s => s.id === rid && s.is_refund);
        if (prev) for (const ln of prev.lines) already.set(ln.sku, (already.get(ln.sku) || 0) + ln.qty);
      }

      const need = new Map();
      for (const it of items) {
        const sku = normSku(it.sku);
        const q = Number(it.qty);
        if (!original.has(sku)) return fail(`SKU ${sku} was not on this sale.`);
        if (!Number.isInteger(q) || q <= 0) return fail(`Invalid refund quantity for ${sku}.`);
        const max = original.get(sku) - (already.get(sku) || 0);
        if (q > max) return fail(`Can only refund up to ${max} of ${sku} from this sale.`);
        need.set(sku, (need.get(sku) || 0) + q);
      }

      const reason = normName(opts.reason) || 'Customer return';
      const restockExpiry = opts.restock_expiry && Dates.isValid(opts.restock_expiry)
        ? opts.restock_expiry : null;

      // Restock each returned line as a new batch
      const lines = [];
      let totalCents = 0;
      for (const [sku, q] of need) {
        const p = this.products.get(sku);
        if (!p) return fail(`Product ${sku} no longer exists; cannot restock.`);
        // Prefer original batch expiry if available from sale lines
        let exp = restockExpiry;
        if (!exp) {
          const origLine = sale.lines.find(l => l.sku === sku);
          if (origLine && origLine.batches && origLine.batches[0]) {
            exp = origLine.batches[0].expiry_date || null;
          }
        }
        const rb = this.addBatch(sku, q, exp);
        if (!rb.ok) return rb;

        const amountCents = toCents(p.price) * q;
        totalCents += amountCents;
        lines.push({ sku, name: p.name, qty: q, price: p.price, amount: amountCents / 100 });
      }

      const refundSale = {
        id: this.nextSaleId++,
        time: new Date().toISOString(),
        date: this.today(),
        lines,
        total: -(totalCents / 100),   // negative = money out / credit reduction
        payment_mode: sale.payment_mode,
        customer: sale.customer,
        is_refund: true,
        original_sale_id: sale.id,
        reason
      };
      this.sales.push(refundSale);
      sale.refund_ids = sale.refund_ids || [];
      sale.refund_ids.push(refundSale.id);

      // Check if original is fully refunded
      let fully = true;
      for (const [sku, origQty] of original) {
        const ret = (already.get(sku) || 0) + (need.get(sku) || 0);
        if (ret < origQty) { fully = false; break; }
      }
      if (fully) sale.refunded = true;

      // Adjust utang if applicable
      let utangAdj = null;
      if (sale.payment_mode === 'utang') {
        const u = this.utangs.find(x => x.sale_id === sale.id);
        if (u && u.status !== 'paid') {
          const reduce = totalCents / 100;
          u.remaining = round2(Math.max(0, u.remaining - reduce));
          u.payments.push({
            time: new Date().toISOString(),
            amount: reduce,
            type: 'refund',
            note: reason
          });
          if (u.remaining <= 0) {
            u.remaining = 0;
            u.status = 'paid';
          } else {
            u.status = 'partial';
          }
          utangAdj = u;
        }
      }

      this.log(`Refund #${refundSale.id} on sale #${sale.id}: ${lines.reduce((s, l) => s + l.qty, 0)} item(s) returned.`);
      return { ok: true, refund: refundSale, sale, utang: utangAdj };
    }

    // ================= utang management =================

    listUtangs(filters = {}) {
      const status = filters.status || '';
      const q = (filters.q || '').trim().toLowerCase();
      const today = this.today();
      return this.utangs
        .map(u => {
          const daysLeft = u.due_date ? Dates.daysBetween(today, u.due_date) : null;
          let effective = u.status;
          if (u.status !== 'paid' && daysLeft != null && daysLeft < 0) effective = 'overdue';
          return { ...u, daysLeft, effective_status: effective };
        })
        .filter(u => {
          if (status === 'open' && !(u.effective_status === 'open' || u.effective_status === 'partial' || u.effective_status === 'overdue')) return false;
          if (status === 'paid' && u.status !== 'paid') return false;
          if (status === 'overdue' && u.effective_status !== 'overdue') return false;
          if (q && !u.customer.toLowerCase().includes(q) && String(u.id).indexOf(q) < 0 && String(u.sale_id).indexOf(q) < 0) return false;
          return true;
        })
        .sort((a, b) => {
          // overdue first, then by due date
          if (a.effective_status === 'overdue' && b.effective_status !== 'overdue') return -1;
          if (b.effective_status === 'overdue' && a.effective_status !== 'overdue') return 1;
          if (a.due_date && b.due_date) return a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0;
          return b.id - a.id;
        });
    }

    /**
     * Record a payment against an open utang.
     * @param {number} utangId
     * @param {number} amount
     * @param {string} [note]
     */
    payUtang(utangId, amount, note) {
      const u = this.utangs.find(x => x.id === Number(utangId));
      if (!u) return fail('Utang record not found.');
      if (u.status === 'paid') return fail('This utang is already fully paid.');
      const amt = parsePrice(amount);
      if (amt === null || amt <= 0) return fail('Payment amount must be greater than 0.');
      if (amt > u.remaining + 0.001) return fail(`Payment exceeds remaining balance of ${u.remaining}.`);

      u.remaining = round2(u.remaining - amt);
      u.payments.push({
        time: new Date().toISOString(),
        amount: amt,
        type: 'payment',
        note: normName(note) || null
      });
      if (u.remaining <= 0) {
        u.remaining = 0;
        u.status = 'paid';
      } else {
        u.status = 'partial';
      }
      this.log(`Payment of ${amt} on utang #${u.id} (${u.customer}). Remaining ${u.remaining}.`);
      return { ok: true, utang: u };
    }

    /**
     * Extend the due date of an open utang.
     * @param {number} utangId
     * @param {{new_due?:string, add_days?:number, note?:string}} opts
     *   Prefer new_due (YYYY-MM-DD). If omitted, add_days (default 7) is added to
     *   the later of today and the current due date.
     */
    extendUtang(utangId, opts = {}) {
      const u = this.utangs.find(x => x.id === Number(utangId));
      if (!u) return fail('Utang record not found.');
      if (u.status === 'paid') return fail('This utang is already fully paid.');

      let newDue = null;
      if (opts.new_due) {
        const d = String(opts.new_due).trim();
        if (!Dates.isValid(d)) return fail('New due date must be a valid date.');
        if (d < this.today()) return fail('New due date cannot be in the past.');
        newDue = d;
      } else {
        const days = Number(opts.add_days);
        const add = Number.isInteger(days) && days > 0 ? days : 7;
        const base = u.due_date && u.due_date > this.today() ? u.due_date : this.today();
        newDue = Dates.addDays(base, add);
      }

      const prev = u.due_date;
      u.due_date = newDue;
      u.extensions = u.extensions || [];
      u.extensions.push({
        time: new Date().toISOString(),
        from: prev,
        to: newDue,
        note: normName(opts.note) || null
      });
      // Keep payment history note trail
      u.payments.push({
        time: new Date().toISOString(),
        amount: 0,
        type: 'extension',
        note: `Due extended ${prev || '—'} → ${newDue}` + (opts.note ? ` (${normName(opts.note)})` : '')
      });
      this.log(`Utang #${u.id} (${u.customer}) due extended to ${newDue}.`);
      return { ok: true, utang: u, previous_due: prev, new_due: newDue };
    }

    // ================= expiry (heap of all dated batches) =================

    /**
     * Batches that are expired or expire within `days` days.
     * Builds ONE heap of every dated batch in O(n), then pops only the batches
     * inside the window: O(n + m log n) for m results.
     */
    expiryReport(days = 14) {
      const all = [];
      for (const heap of this.heaps.values()) heap.forEach(b => { if (b.expiry_date) all.push(b); });
      const heap = MinHeap.from(all, batchCmp);
      const today = this.today();
      const expired = [], soon = [];
      while (!heap.isEmpty()) {
        const b = heap.peek();
        const daysLeft = Dates.daysBetween(today, b.expiry_date);
        if (daysLeft > days) break;
        heap.pop();
        const product = this.products.get(b.sku);
        const row = { batch: b, product, daysLeft, value: round2(b.qty * product.price) };
        (daysLeft < 0 ? expired : soon).push(row);
      }
      return { expired, soon, examined: all.length };
    }

    /**
     * Remove every expired batch. Expired batches are always at the top of their
     * SKU's heap, so we simply pop until the top is no longer expired.
     */
    pullOutExpired() {
      let batches = 0, qty = 0, lossCents = 0;
      for (const [sku, heap] of this.heaps) {
        const p = this.products.get(sku);
        while (!heap.isEmpty() && this.isExpired(heap.peek())) {
          const b = heap.pop();
          batches++; qty += b.qty; lossCents += toCents(p.price) * b.qty;
        }
      }
      const loss = lossCents / 100;
      if (batches) {
        this.losses.push({
          time: new Date().toISOString(),
          date: this.today(),
          batches, qty, loss
        });
        if (this.losses.length > 100) this.losses.shift();
        this.log(`Pulled out ${batches} expired batch(es), ${qty} pcs. Loss ~${loss}.`);
      }
      return { ok: true, batches, qty, loss };
    }

    summary(report) {
      const rep = report || this.expiryReport(14);
      let low = 0, out = 0, valueCents = 0;
      for (const p of this.products.values()) {
        const info = this.stockInfo(p.sku);
        if (info.status === 'low') low++;
        else if (info.status === 'out') out++;
        valueCents += toCents(p.price) * info.sellable;
      }
      return {
        products: this.products.size, low, out,
        inventoryValue: valueCents / 100,
        expiredBatches: rep.expired.length,
        expiredValue: round2(rep.expired.reduce((s, r) => s + r.value, 0)),
        soonBatches: rep.soon.length
      };
    }

    /**
     * Overall financial snapshot.
     * - Inventory assets = sellable stock at selling price
     * - Utang assets = outstanding customer credit
     * - Cash intake = sum of cash sales (net of cash refunds)
     * - Expired losses = cumulative pull-out losses
     * - Net position ≈ inventory + utang assets - losses (illustrative)
     */
    financeSummary() {
      const inv = this.summary();
      let cashIn = 0, cashOut = 0, utangCreated = 0, utangCollected = 0;
      for (const s of this.sales) {
        if (s.is_refund) {
          if (s.payment_mode === 'cash') cashOut += Math.abs(s.total);
          // utang refunds already reduce remaining; no double-count
        } else if (s.payment_mode === 'cash') {
          cashIn += s.total;
        } else if (s.payment_mode === 'utang') {
          utangCreated += s.total;
        }
      }
      for (const u of this.utangs) {
        for (const pay of (u.payments || [])) {
          if (pay.type === 'payment') utangCollected += pay.amount;
        }
      }
      const outstanding = round2(this.utangs
        .filter(u => u.status !== 'paid')
        .reduce((s, u) => s + u.remaining, 0));
      const totalLoss = round2(this.losses.reduce((s, l) => s + l.loss, 0));
      const netCash = round2(cashIn - cashOut + utangCollected);
      const netWorth = round2(inv.inventoryValue + outstanding); // assets side
      return {
        inventoryValue: inv.inventoryValue,
        outstandingUtang: outstanding,
        assets: netWorth,
        cashSales: round2(cashIn),
        cashRefunds: round2(cashOut),
        utangCreated: round2(utangCreated),
        utangCollected: round2(utangCollected),
        netCash,
        expiredLoss: totalLoss,
        netGain: round2(netCash - totalLoss),   // simplified trading result
        openUtangs: this.utangs.filter(u => u.status !== 'paid').length,
        overdueUtangs: this.listUtangs({ status: 'overdue' }).length
      };
    }

    /** YYYY-MM key for the current clock month. */
    currentMonthKey() {
      return this.today().slice(0, 7);
    }

    /**
     * Save (or refresh) a monthly finance snapshot.
     * One report per month key; re-saving updates the same month.
     */
    saveFinanceReport(label) {
      const summary = this.financeSummary();
      const month = this.currentMonthKey();
      const report = {
        id: month,
        month,
        label: normName(label) || month,
        saved_at: new Date().toISOString(),
        date: this.today(),
        ...summary
      };
      const idx = this.financeReports.findIndex(r => r.month === month);
      if (idx >= 0) this.financeReports[idx] = report;
      else this.financeReports.push(report);
      this.financeReports.sort((a, b) => (a.month < b.month ? 1 : a.month > b.month ? -1 : 0));
      if (this.financeReports.length > 36) this.financeReports.length = 36;
      this.log(`Finance report saved for ${month}.`);
      return { ok: true, report };
    }

    listFinanceReports() {
      return this.financeReports.slice().sort((a, b) => (a.month < b.month ? 1 : a.month > b.month ? -1 : 0));
    }

    getFinanceReport(monthOrId) {
      const key = String(monthOrId || '');
      return this.financeReports.find(r => r.month === key || r.id === key) || null;
    }

    /**
     * Notification payloads for the UI.
     * Returns arrays the UI can show as badges / lists.
     */
    notifications(warnDays = 14) {
      const low = this.reorderList().map(({ product, info }) => ({
        type: 'low_stock',
        sku: product.sku,
        name: product.name,
        sellable: info.sellable,
        reorder: product.reorder_level,
        status: info.status
      }));
      const rep = this.expiryReport(warnDays);
      const near = rep.soon.map(r => ({
        type: 'near_expiry',
        sku: r.product.sku,
        name: r.product.name,
        qty: r.batch.qty,
        expiry: r.batch.expiry_date,
        daysLeft: r.daysLeft,
        value: r.value
      }));
      const expired = rep.expired.map(r => ({
        type: 'expired',
        sku: r.product.sku,
        name: r.product.name,
        qty: r.batch.qty,
        expiry: r.batch.expiry_date,
        daysLeft: r.daysLeft,
        value: r.value
      }));
      const deadlines = this.listUtangs({ status: 'open' })
        .filter(u => u.daysLeft != null && u.daysLeft <= 3)
        .map(u => ({
          type: u.effective_status === 'overdue' ? 'utang_overdue' : 'utang_due',
          id: u.id,
          customer: u.customer,
          remaining: u.remaining,
          due_date: u.due_date,
          daysLeft: u.daysLeft
        }));
      return {
        low_stock: low,
        near_expiry: near,
        expired,
        utang_deadlines: deadlines,
        total: low.length + near.length + expired.length + deadlines.length
      };
    }

    // ================= save / load =================

    toJSON() {
      const batches = [];
      for (const heap of this.heaps.values()) heap.forEach(b => batches.push({ ...b }));
      return {
        format: 'store-inventory-state', version: 3, saved_at: new Date().toISOString(),
        settings: this.settings,
        nextBatchId: this.nextBatchId,
        nextSaleId: this.nextSaleId,
        nextUtangId: this.nextUtangId,
        nextRefundId: this.nextRefundId,
        products: [...this.products.values()].map(p => ({ ...p })),
        batches,
        sales: this.sales,
        activity: this.activity,
        utangs: this.utangs,
        losses: this.losses,
        financeReports: this.financeReports
      };
    }

    load(obj) {
      if (!obj || obj.format !== 'store-inventory-state' ||
          !Array.isArray(obj.products) || !Array.isArray(obj.batches)) {
        throw new Error('This is not a saved inventory file.');
      }
      this._reset();
      for (const p of obj.products) this.addProduct(p);
      let maxId = 0;
      for (const b of obj.batches) {
        const heap = this.heaps.get(normSku(b.sku));
        const c = this.checkBatch(b.qty, b.expiry_date);
        if (!heap || !c.ok || !Number.isInteger(b.id)) continue;
        heap.push({ id: b.id, sku: normSku(b.sku), qty: c.qty, expiry_date: c.expiry, received_date: b.received_date || this.today() });
        maxId = Math.max(maxId, b.id);
      }
      this.sales = Array.isArray(obj.sales) ? obj.sales : [];
      this.activity = Array.isArray(obj.activity) ? obj.activity : [];
      this.financeReports = Array.isArray(obj.financeReports) ? obj.financeReports : [];
      this.utangs = Array.isArray(obj.utangs) ? obj.utangs : [];
      this.losses = Array.isArray(obj.losses) ? obj.losses : [];
      this.settings = obj.settings && typeof obj.settings === 'object' ? obj.settings : {};
      this.nextBatchId = Math.max(Number(obj.nextBatchId) || 1, maxId + 1);
      const maxSale = this.sales.reduce((m, s) => Math.max(m, s.id || 0), 0);
      this.nextSaleId = Math.max(Number(obj.nextSaleId) || 1, maxSale + 1);
      const maxUtang = this.utangs.reduce((m, u) => Math.max(m, u.id || 0), 0);
      this.nextUtangId = Math.max(Number(obj.nextUtangId) || 1, maxUtang + 1);
      this.nextRefundId = Number(obj.nextRefundId) || 1;

      // Migrate old sales that lack payment_mode
      for (const s of this.sales) {
        if (!s.payment_mode) s.payment_mode = 'cash';
        if (s.refunded == null) s.refunded = false;
        if (!s.refund_ids) s.refund_ids = [];
      }
    }

    /** Load the sample-data format (products with batches; expiry_in_days is relative to today). */
    importSeed(seed) {
      if (!seed || !Array.isArray(seed.products)) throw new Error('The file needs a "products" list.');
      this._reset();
      const today = this.today();
      const errors = [];
      for (const sp of seed.products) {
        const r = this.addProduct(sp);
        if (!r.ok) { errors.push(`${sp.sku}: ${r.error}`); continue; }
        for (const b of sp.batches || []) {
          const exp = b.expiry_in_days != null ? Dates.addDays(today, Number(b.expiry_in_days)) : (b.expiry_date || null);
          const rb = this.addBatch(r.product.sku, b.qty, exp);
          if (!rb.ok) errors.push(`${sp.sku}: ${rb.error}`);
        }
      }
      this.activity = [];
      this.sales = [];
      this.utangs = [];
      this.losses = [];
      this.log(`Loaded ${this.products.size} sample products.`);
      return { ok: true, added: this.products.size, errors };
    }

    /** Accepts either a saved-state file or a sample-data file. */
    importAny(obj) {
      if (obj && obj.format === 'store-inventory-state') { this.load(obj); return { ok: true, errors: [] }; }
      return this.importSeed(obj);
    }
  }

  const api = { Inventory, Dates, batchCmp, NO_EXPIRY, categoryPrefix };
  root.InventoryLib = api;
  if (isNode) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
