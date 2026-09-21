/*
 * tests.js
 * ---------------------------------------------------------------
 * Evidence for the "Testing, Evidence, Results" criterion.
 *   runTests()       -> unit tests for the heap and the inventory rules
 *   runBenchmarks()  -> measured running times for growing input sizes
 *
 * Open tests.html in a browser to run them, or run `node js/run-tests.js`.
 */
(function (root) {
  'use strict';

  const isNode = typeof module !== 'undefined' && module.exports && typeof require === 'function';
  const { MinHeap } = isNode ? require('./structures.js') : root.Structures;
  const { Inventory, Dates, batchCmp } = isNode ? require('./inventory.js') : root.InventoryLib;

  const TODAY = '2026-09-20';
  const day = n => Dates.addDays(TODAY, n);
  const mk = () => new Inventory({ clock: () => TODAY, defaultReorder: 5 });
  const withProduct = (inv, sku = 'A', price = 10, reorder = 5) =>
    inv.addProduct({ sku, name: 'Item ' + sku, category: 'Test', price, reorder_level: reorder });

  const assert = {
    ok(cond, msg) { if (!cond) throw new Error(msg || 'Expected a truthy value'); },
    eq(actual, expected, msg) {
      const a = JSON.stringify(actual), e = JSON.stringify(expected);
      if (a !== e) throw new Error((msg ? msg + ': ' : '') + `expected ${e}, got ${a}`);
    }
  };

  // small deterministic random generator so results are repeatable
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ======================================================================
  function runTests() {
    const results = [];
    const test = (group, name, fn) => {
      try { fn(); results.push({ group, name, pass: true }); }
      catch (e) { results.push({ group, name, pass: false, error: e.message }); }
    };

    // ---------- MinHeap ----------
    test('MinHeap', 'pops 500 random numbers in ascending order', () => {
      const r = rng(1), h = new MinHeap((a, b) => a - b), src = [];
      for (let i = 0; i < 500; i++) { const v = Math.floor(r() * 1000); src.push(v); h.push(v); }
      const out = []; while (!h.isEmpty()) out.push(h.pop());
      assert.eq(out, src.slice().sort((a, b) => a - b));
    });
    test('MinHeap', 'peek returns the minimum without removing it', () => {
      const h = new MinHeap((a, b) => a - b); [5, 3, 8].forEach(x => h.push(x));
      assert.eq(h.peek(), 3); assert.eq(h.size(), 3);
    });
    test('MinHeap', 'pop and peek on an empty heap return undefined', () => {
      const h = new MinHeap((a, b) => a - b);
      assert.eq(h.pop(), undefined); assert.eq(h.peek(), undefined);
    });
    test('MinHeap', 'handles duplicate keys', () => {
      const h = new MinHeap((a, b) => a - b); [2, 2, 1, 1, 3, 3].forEach(x => h.push(x));
      const out = []; while (!h.isEmpty()) out.push(h.pop());
      assert.eq(out, [1, 1, 2, 2, 3, 3]);
    });
    test('MinHeap', 'from() (heapify) gives the same order as sorting', () => {
      const r = rng(2), src = Array.from({ length: 300 }, () => Math.floor(r() * 500));
      const h = MinHeap.from(src, (a, b) => a - b), out = [];
      while (!h.isEmpty()) out.push(h.pop());
      assert.eq(out, src.slice().sort((a, b) => a - b));
    });
    test('MinHeap', 'removeWhere keeps the heap property', () => {
      const h = MinHeap.from([9, 4, 7, 1, 8, 2, 6], (a, b) => a - b);
      assert.eq(h.removeWhere(x => x % 2 === 0), 4);
      const out = []; while (!h.isEmpty()) out.push(h.pop());
      assert.eq(out, [1, 7, 9]);
    });

    // ---------- Products ----------
    test('Products', 'adds a product and finds it by SKU (case-insensitive)', () => {
      const inv = mk(); assert.ok(withProduct(inv, 'snk-1').ok);
      assert.eq(inv.getProduct('SNK-1').sku, 'SNK-1');
    });
    test('Products', 'rejects a duplicate SKU', () => {
      const inv = mk(); withProduct(inv, 'A');
      const r = withProduct(inv, 'a'); assert.ok(!r.ok); assert.ok(/already exists/.test(r.error));
    });
    test('Products', 'rejects empty name, blank/negative price, bad reorder level', () => {
      const inv = mk();
      assert.ok(!inv.addProduct({ sku: 'X', name: '  ', price: 5 }).ok);
      assert.ok(!inv.addProduct({ sku: 'X', name: 'X', price: '' }).ok);
      assert.ok(!inv.addProduct({ sku: 'X', name: 'X', price: -1 }).ok);
      assert.ok(!inv.addProduct({ sku: 'X', name: 'X', price: 5, reorder_level: 2.5 }).ok);
    });
    test('Products', 'removing a product also removes its batches', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 5, day(10));
      inv.removeProduct('A');
      assert.eq(inv.batchesOf('A'), []); assert.ok(!inv.getProduct('A'));
    });
    test('Products', 'search matches name, SKU and category, ignoring case', () => {
      const inv = mk(); withProduct(inv, 'RICE-1');
      assert.eq(inv.listProducts({ q: 'rice' }).length, 1);
      assert.eq(inv.listProducts({ q: 'item r' }).length, 1);
      assert.eq(inv.listProducts({ q: 'TEST' }).length, 1);
      assert.eq(inv.listProducts({ q: 'zzz' }).length, 0);
    });

    // ---------- Batches ----------
    test('Batches', 'rejects quantity 0, negative, decimal or text', () => {
      const inv = mk(); withProduct(inv);
      [0, -1, 2.5, 'abc', ''].forEach(q => assert.ok(!inv.addBatch('A', q, day(5)).ok, 'qty ' + q));
    });
    test('Batches', 'rejects an impossible date (2026-02-30) and an unknown SKU', () => {
      const inv = mk(); withProduct(inv);
      assert.ok(!inv.addBatch('A', 5, '2026-02-30').ok);
      assert.ok(!inv.addBatch('NOPE', 5, day(5)).ok);
    });
    test('Batches', 'batchesOf lists earliest expiry first', () => {
      const inv = mk(); withProduct(inv);
      inv.addBatch('A', 1, day(30)); inv.addBatch('A', 2, day(5)); inv.addBatch('A', 3, day(15));
      assert.eq(inv.batchesOf('A').map(b => b.qty), [2, 3, 1]);
    });

    // ---------- Selling (FEFO) ----------
    test('Selling', 'takes from the earliest-expiring batch first', () => {
      const inv = mk(); withProduct(inv);
      inv.addBatch('A', 5, day(60)); inv.addBatch('A', 5, day(10));
      const r = inv.sell([{ sku: 'A', qty: 3 }]);
      assert.ok(r.ok); assert.eq(r.sale.lines[0].batches[0].expiry_date, day(10));
      assert.eq(inv.batchesOf('A').map(b => b.qty), [2, 5]);
    });
    test('Selling', 'a sale can span two batches', () => {
      const inv = mk(); withProduct(inv);
      inv.addBatch('A', 2, day(10)); inv.addBatch('A', 5, day(60));
      const r = inv.sell([{ sku: 'A', qty: 4 }]);
      assert.eq(r.sale.lines[0].batches.map(b => b.qty), [2, 2]);
      assert.eq(inv.batchesOf('A').map(b => b.qty), [3]);
    });
    test('Selling', 'expired stock is never sold', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 10, day(-1));
      const r = inv.sell([{ sku: 'A', qty: 1 }]);
      assert.ok(!r.ok); assert.eq(inv.stockInfo('A').total, 10);
    });
    test('Selling', 'skips an expired batch on top and sells the good one behind it', () => {
      const inv = mk(); withProduct(inv);
      inv.addBatch('A', 4, day(-19)); inv.addBatch('A', 5, day(40));
      assert.ok(inv.sell([{ sku: 'A', qty: 5 }]).ok);
      const info = inv.stockInfo('A');
      assert.eq([info.sellable, info.expired], [0, 4]);
    });
    test('Selling', 'a batch expiring today can still be sold', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 3, day(0));
      assert.ok(inv.sell([{ sku: 'A', qty: 3 }]).ok);
    });
    test('Selling', 'all-or-nothing: one short line leaves every stock unchanged', () => {
      const inv = mk(); withProduct(inv, 'A'); withProduct(inv, 'B');
      inv.addBatch('A', 5, day(10)); inv.addBatch('B', 1, day(10));
      const r = inv.sell([{ sku: 'A', qty: 2 }, { sku: 'B', qty: 2 }]);
      assert.ok(!r.ok); assert.eq(inv.stockInfo('A').sellable, 5); assert.eq(inv.stockInfo('B').sellable, 1);
      assert.eq(inv.sales.length, 0);
    });
    test('Selling', 'duplicate cart lines for one SKU are merged', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 10, day(10));
      const r = inv.sell([{ sku: 'A', qty: 2 }, { sku: 'A', qty: 3 }]);
      assert.eq(r.sale.lines.length, 1); assert.eq(r.sale.lines[0].qty, 5);
    });
    test('Selling', 'empty cart, unknown SKU and quantity 0 are rejected', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 5, day(10));
      assert.ok(!inv.sell([]).ok);
      assert.ok(!inv.sell([{ sku: 'ZZZ', qty: 1 }]).ok);
      assert.ok(!inv.sell([{ sku: 'A', qty: 0 }]).ok);
    });
    test('Selling', 'selling from an empty product fails cleanly', () => {
      const inv = mk(); withProduct(inv);
      assert.ok(!inv.sell([{ sku: 'A', qty: 1 }]).ok);
    });
    test('Selling', 'equal expiry dates are used in the order they were received', () => {
      const inv = mk(); withProduct(inv);
      const first = inv.addBatch('A', 2, day(20)).batch.id; inv.addBatch('A', 2, day(20));
      const r = inv.sell([{ sku: 'A', qty: 1 }]);
      assert.eq(r.sale.lines[0].batches[0].batch_id, first);
    });
    test('Selling', 'stock with no expiry date is sold last', () => {
      const inv = mk(); withProduct(inv);
      inv.addBatch('A', 5, null); inv.addBatch('A', 5, day(100));
      inv.sell([{ sku: 'A', qty: 5 }]);
      assert.eq(inv.batchesOf('A').map(b => b.expiry_date), [null]);
    });
    test('Selling', 'money is exact: 3 x 19.99 = 59.97', () => {
      const inv = mk(); withProduct(inv, 'A', 19.99); inv.addBatch('A', 10, day(10));
      assert.eq(inv.sell([{ sku: 'A', qty: 3 }]).sale.total, 59.97);
    });

    // ---------- Status & expiry ----------
    test('Status', 'out / low / ok follow the reorder level', () => {
      const inv = mk(); withProduct(inv, 'A', 10, 5);
      assert.eq(inv.stockInfo('A').status, 'out');
      inv.addBatch('A', 3, day(50)); assert.eq(inv.stockInfo('A').status, 'low');
      inv.addBatch('A', 3, day(60)); assert.eq(inv.stockInfo('A').status, 'ok');
    });
    test('Status', 'expired units do not count as sellable stock', () => {
      const inv = mk(); withProduct(inv, 'A', 10, 5);
      inv.addBatch('A', 6, day(-5)); inv.addBatch('A', 3, day(50));
      const i = inv.stockInfo('A'); assert.eq([i.sellable, i.expired, i.status], [3, 6, 'low']);
    });
    test('Expiry report', 'splits expired / soon and respects the window edge', () => {
      const inv = mk(); withProduct(inv);
      [-1, 0, 5, 14, 15].forEach(n => inv.addBatch('A', 1, day(n)));
      inv.addBatch('A', 1, null);
      const rep = inv.expiryReport(14);
      assert.eq(rep.expired.length, 1); assert.eq(rep.soon.map(r => r.daysLeft), [0, 5, 14]);
    });
    test('Expiry report', 'lists results earliest first', () => {
      const inv = mk(); withProduct(inv);
      [9, 3, 12, 6].forEach(n => inv.addBatch('A', 1, day(n)));
      assert.eq(inv.expiryReport(30).soon.map(r => r.daysLeft), [3, 6, 9, 12]);
    });
    test('Expiry report', 'stock without an expiry date never appears', () => {
      const inv = mk(); withProduct(inv); inv.addBatch('A', 5, null);
      const rep = inv.expiryReport(365); assert.eq(rep.expired.length + rep.soon.length, 0);
    });
    test('Expiry report', 'pullOutExpired removes only expired batches and totals the loss', () => {
      const inv = mk(); withProduct(inv, 'A', 12.5);
      inv.addBatch('A', 4, day(-2)); inv.addBatch('A', 6, day(-9)); inv.addBatch('A', 7, day(30));
      const r = inv.pullOutExpired();
      assert.eq([r.batches, r.qty, r.loss], [2, 10, 125]);
      assert.eq(inv.batchesOf('A').map(b => b.qty), [7]);
    });

    // ---------- Save / load ----------
    test('Save / load', 'round trip keeps stock, batch order and id counters', () => {
      const inv = mk(); withProduct(inv); withProduct(inv, 'B', 4);
      inv.addBatch('A', 5, day(30)); inv.addBatch('A', 2, day(3)); inv.addBatch('B', 9, null);
      inv.sell([{ sku: 'A', qty: 1 }]);
      const copy = mk(); copy.load(JSON.parse(JSON.stringify(inv.toJSON())));
      assert.eq(copy.batchesOf('A'), inv.batchesOf('A'));
      assert.eq(copy.stockInfo('B'), inv.stockInfo('B'));
      assert.eq(copy.sales.length, 1);
      const id = copy.addBatch('B', 1, day(5)).batch.id;
      assert.ok(id > Math.max(...inv.batchesOf('A').concat(inv.batchesOf('B')).map(b => b.id)));
    });
    test('Save / load', 'rejects a file that is not a saved inventory', () => {
      let threw = false; try { mk().load({ hello: 1 }); } catch (e) { threw = true; }
      assert.ok(threw);
    });
    test('Save / load', 'sample data: expiry_in_days becomes a real date, no batches means out of stock', () => {
      const inv = mk();
      inv.importSeed({ products: [
        { sku: 'P1', name: 'P1', price: 5, batches: [{ qty: 3, expiry_in_days: 5 }, { qty: 2 }] },
        { sku: 'P2', name: 'P2', price: 5, batches: [] }
      ] });
      assert.eq(inv.batchesOf('P1').map(b => b.expiry_date), [day(5), null]);
      assert.eq(inv.stockInfo('P2').status, 'out');
    });

    return results;
  }

  // ======================================================================
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Number(process.hrtime.bigint()) / 1e6);
  function median(xs) { const s = xs.slice().sort((a, b) => a - b); return s[s.length >> 1]; }
  function timeIt(fn, reps = 5) {
    const t = [];
    for (let i = 0; i < reps; i++) { const s = now(); fn(); t.push(now() - s); }
    return median(t);
  }

  function runBenchmarks(sizes = [1000, 10000, 100000]) {
    const rows = [
      { label: 'Build a heap with n pushes', big: 'O(n log n)', ms: {} },
      { label: 'Build a heap with heapify', big: 'O(n)', ms: {} },
      { label: '10 soonest expiries: heapify + 10 pops', big: 'O(n + k log n)', ms: {} },
      { label: '10 soonest expiries: sort everything', big: 'O(n log n)', ms: {} },
      { label: '10 soonest expiries: 10 linear scans', big: 'O(k n)', ms: {} },
      { label: '1,000 SKU lookups: Map', big: 'O(1) each', ms: {} },
      { label: '1,000 SKU lookups: Array.find', big: 'O(n) each', ms: {} }
    ];
    const r = rng(7);
    for (const n of sizes) {
      const batches = Array.from({ length: n }, (_, i) => ({ id: i, expiry_date: day(Math.floor(r() * 1095)) }));
      rows[0].ms[n] = timeIt(() => { const h = new MinHeap(batchCmp); for (const b of batches) h.push(b); });
      rows[1].ms[n] = timeIt(() => { MinHeap.from(batches, batchCmp); });
      rows[2].ms[n] = timeIt(() => { const h = MinHeap.from(batches, batchCmp); for (let i = 0; i < 10; i++) h.pop(); });
      rows[3].ms[n] = timeIt(() => { batches.slice().sort(batchCmp).slice(0, 10); });
      rows[4].ms[n] = timeIt(() => {
        const copy = batches.slice();
        for (let k = 0; k < 10; k++) {
          let m = 0;
          for (let i = 1; i < copy.length; i++) if (batchCmp(copy[i], copy[m]) < 0) m = i;
          copy.splice(m, 1);
        }
      });
      const skus = Array.from({ length: n }, (_, i) => 'SKU-' + String(i).padStart(7, '0'));
      const products = skus.map(s => ({ sku: s }));
      const map = new Map(products.map(p => [p.sku, p]));
      const probes = Array.from({ length: 1000 }, () => skus[Math.floor(r() * n)]);
      rows[5].ms[n] = timeIt(() => { for (const s of probes) map.get(s); });
      rows[6].ms[n] = timeIt(() => { for (const s of probes) products.find(p => p.sku === s); }, 3);
    }
    return { sizes, rows };
  }

  const api = { runTests, runBenchmarks };
  root.StoreTests = api;
  if (isNode) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
