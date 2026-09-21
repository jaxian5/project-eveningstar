/*
 * inventory.js
 * ---------------------------------------------------------------
 * All business logic. No DOM code, so it can be unit-tested in Node.
 *
 * Data structures used
 *   products : Map<sku, product>          hash table -> O(1) lookup, unique SKUs
 *   heaps    : Map<sku, MinHeap<batch>>   one min-heap per SKU, keyed by expiry date
 *
 * A "batch" is one delivery of a product:
 *   { id, sku, qty, expiry_date: 'YYYY-MM-DD' | null, received_date }
 * A batch with no expiry date is treated as expiring on 9999-12-31, so it
 * always sorts last and never shows up in expiry reports.
 *
 * Rule: a batch is EXPIRED when expiry_date < today. It is still sellable on
 * its expiry date itself. Expired stock can never be sold; it must be pulled out.
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
      this.settings = {};
      this.nextBatchId = 1;
      this.nextSaleId = 1;
    }

    today() { return this.clock(); }
    isExpired(batch) { return !!batch.expiry_date && batch.expiry_date < this.today(); }

    log(message) {
      this.activity.unshift({ message, time: new Date().toISOString() });
      if (this.activity.length > 12) this.activity.length = 12;
    }

    _reset() {
      this.products.clear();
      this.heaps.clear();
      this.sales = [];
      this.activity = [];
      this.nextBatchId = 1;
      this.nextSaleId = 1;
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
     */
    sell(items) {
      if (!Array.isArray(items) || items.length === 0) return fail('The cart is empty.');

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
        id: this.nextSaleId++, time: new Date().toISOString(), date: this.today(),
        lines, total: totalCents / 100
      };
      this.sales.push(sale);
      if (this.sales.length > 200) this.sales.shift();
      this.log(`Sale #${sale.id}: ${lines.reduce((s, l) => s + l.qty, 0)} item(s).`);
      return { ok: true, sale };
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
      if (batches) this.log(`Pulled out ${batches} expired batch(es), ${qty} pcs.`);
      return { ok: true, batches, qty, loss: lossCents / 100 };
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

    // ================= save / load =================

    toJSON() {
      const batches = [];
      for (const heap of this.heaps.values()) heap.forEach(b => batches.push({ ...b }));
      return {
        format: 'store-inventory-state', version: 2, saved_at: new Date().toISOString(),
        settings: this.settings, nextBatchId: this.nextBatchId, nextSaleId: this.nextSaleId,
        products: [...this.products.values()].map(p => ({ ...p })),
        batches, sales: this.sales, activity: this.activity
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
      this.settings = obj.settings && typeof obj.settings === 'object' ? obj.settings : {};
      this.nextBatchId = Math.max(Number(obj.nextBatchId) || 1, maxId + 1);
      const maxSale = this.sales.reduce((m, s) => Math.max(m, s.id || 0), 0);
      this.nextSaleId = Math.max(Number(obj.nextSaleId) || 1, maxSale + 1);
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
      this.log(`Loaded ${this.products.size} sample products.`);
      return { ok: true, added: this.products.size, errors };
    }

    /** Accepts either a saved-state file or a sample-data file. */
    importAny(obj) {
      if (obj && obj.format === 'store-inventory-state') { this.load(obj); return { ok: true, errors: [] }; }
      return this.importSeed(obj);
    }
  }

  const api = { Inventory, Dates, batchCmp, NO_EXPIRY };
  root.InventoryLib = api;
  if (isNode) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
