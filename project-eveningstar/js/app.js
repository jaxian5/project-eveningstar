/*
 * app.js
 * ---------------------------------------------------------------
 * The user interface. All rules live in inventory.js; this file only
 * reads the user's input, calls the Inventory, and draws the result.
 */
(() => {
  'use strict';

  const { Inventory, Dates } = window.InventoryLib;

  // ---------------------------------------------------------------- config
  const DEFAULT_CONFIG = {
    store_name: 'Store Inventory',
    currency: 'PHP',
    locale: 'en-PH',
    expiry_warning_days: 14,
    default_reorder_level: 5,
    storage_key: 'store-inventory-v2',
    slip_footer: 'Thank you! This is a sales slip, not an official BIR receipt.'
  };
  const THEME_KEY = 'si-theme';

  // Used only when data/products.json cannot be fetched (e.g. index.html opened straight from disk).
  const FALLBACK_SEED = {
    products: [
      { sku: 'RICE-001', name: 'Sinandomeng rice (per kg)', category: 'Rice', price: 56, reorder_level: 20, batches: [{ qty: 40, expiry_in_days: 150 }] },
      { sku: 'CAN-001', name: 'Corned beef 150g', category: 'Canned goods', price: 38, reorder_level: 10, batches: [{ qty: 6, expiry_in_days: -3 }, { qty: 10, expiry_in_days: 300 }] },
      { sku: 'CAN-003', name: 'Tuna flakes 155g', category: 'Canned goods', price: 36, reorder_level: 8, batches: [{ qty: 9, expiry_in_days: 6 }, { qty: 12, expiry_in_days: 400 }] },
      { sku: 'NOO-002', name: 'Instant mami beef 55g', category: 'Noodles', price: 14, reorder_level: 15, batches: [{ qty: 8, expiry_in_days: -10 }] },
      { sku: 'SNK-002', name: 'BBQ corn chips 27g', category: 'Snacks', price: 10, reorder_level: 12, batches: [{ qty: 5, expiry_in_days: 11 }] },
      { sku: 'BEV-002', name: 'Orange soda 500ml', category: 'Beverages', price: 25, reorder_level: 8, batches: [] },
      { sku: 'ALC-001', name: 'Beer 500ml bottle', category: 'Alcohol', price: 55, reorder_level: 12, batches: [{ qty: 36 }] }
    ]
  };

  // ---------------------------------------------------------------- icons
  const ICONS = {
    package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    flask: '<path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    trend: '<path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"/><path d="m2 7 8 8 4-4 8 8"/>'
  };
  const icon = name =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  const renderIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

  // ---------------------------------------------------------------- state & helpers
  const state = {
    config: { ...DEFAULT_CONFIG },
    inv: null,
    view: 'inventory',
    filters: { q: '', category: '', status: '' },
    cart: [],
    lastSaleId: null,
    warnDays: 14,
    editSku: null,
    batchSku: null,
    report: null,
    fmt: null,
    storageWarned: false
  };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const peso = n => state.fmt.format(n);
  const safeGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

  function fmtDate(str) {
    return Dates.parse(str).toLocaleDateString(state.config.locale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function fmtTime(iso) {
    return new Date(iso).toLocaleString(state.config.locale, { dateStyle: 'medium', timeStyle: 'short' });
  }

  let toastTimer;
  function notify(msg, type = 'info') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = `toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4500);
  }

  function showNotice(text) { $('#notice-text').textContent = text; $('#notice').hidden = false; }

  function askConfirm(message, okLabel = 'Confirm', danger = true) {
    return new Promise(resolve => {
      const dlg = $('#confirm-dialog');
      $('#confirm-msg').textContent = message;
      const ok = $('#confirm-ok');
      ok.textContent = okLabel;
      ok.classList.toggle('danger', danger);
      ok.classList.toggle('primary', !danger);
      dlg.returnValue = '';
      dlg.addEventListener('close', () => resolve(dlg.returnValue === 'ok'), { once: true });
      dlg.showModal();
    });
  }

  function persist() {
    state.inv.settings.expiryWarningDays = state.warnDays;
    const ok = safeSet(state.config.storage_key, JSON.stringify(state.inv.toJSON()));
    if (!ok && !state.storageWarned) {
      state.storageWarned = true;
      notify("This browser isn't saving data. Use Export JSON to keep your changes.", 'error');
    }
  }

  async function fetchJSON(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------- status labels
  const STATUS = { ok: ['ok', 'In stock'], low: ['warn', 'Low stock'], out: ['bad', 'Out of stock'] };

  function dayBadge(d) {
    if (d < 0) return `<span class="badge bad">Expired ${-d}d ago</span>`;
    if (d === 0) return '<span class="badge warn">Expires today</span>';
    if (d <= state.warnDays) return `<span class="badge warn">${d}d left</span>`;
    return `<span class="badge neutral">${d}d left</span>`;
  }

  // ---------------------------------------------------------------- render: shell
  const TITLES = { inventory: 'Inventory', billing: 'Billing', expiry: 'Expiry watch' };

  function setView(view) {
    state.view = view;
    $$('.view').forEach(v => { v.hidden = v.id !== `view-${view}`; });
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $('#page-title').textContent = TITLES[view];
    closeSidebar();
    render();
    if (view === 'billing') $('#b-sku').focus();
  }
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }

  function render() {
    const rep = state.inv.expiryReport(state.warnDays);
    state.report = rep;
    const n = rep.expired.length + rep.soon.length;
    const badge = $('#nav-expiry-badge');
    badge.hidden = n === 0;
    badge.textContent = n;
    if (state.view === 'inventory') renderInventory(rep);
    else if (state.view === 'billing') renderBilling();
    else renderExpiry(rep);
  }

  // ---------------------------------------------------------------- render: inventory
  function renderInventory(rep) {
    renderSummary(rep);
    renderCategoryOptions();
    renderTable();
    renderSidePanels(rep);
  }

  function renderSummary(rep) {
    const s = state.inv.summary(rep);
    const cards = [
      { label: 'Products', value: s.products, icon: 'package', tone: '', note: `${s.out} out of sellable stock` },
      { label: 'Needs reorder', value: s.low + s.out, icon: 'alert', tone: 'amber', note: `${s.low} low, ${s.out} out` },
      { label: 'Expired batches', value: s.expiredBatches, icon: 'clock', tone: 'red', note: s.expiredBatches ? `About ${peso(s.expiredValue)} at selling price` : 'Nothing to pull out', emphasis: s.expiredBatches > 0 },
      { label: 'Sellable stock value', value: peso(s.inventoryValue), icon: 'tag', tone: 'green', note: 'At selling price, expired excluded' }
    ];
    $('#summary-cards').innerHTML = cards.map(c => `
      <article class="card ${c.tone ? 'tone-' + c.tone : ''} ${c.emphasis ? 'emphasis' : ''}">
        <div class="card-top"><span>${c.label}</span>${icon(c.icon)}</div>
        <div class="card-value">${c.value}</div>
        <div class="card-note">${c.note}</div>
      </article>`).join('');
  }

  function renderCategoryOptions() {
    const sel = $('#f-category');
    const cats = state.inv.categories();
    sel.innerHTML = '<option value="">All categories</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    sel.value = cats.includes(state.filters.category) ? state.filters.category : '';
    state.filters.category = sel.value;
    $('#category-options').innerHTML = cats.map(c => `<option value="${esc(c)}"></option>`).join('');
  }

  function renderTable() {
    const inv = state.inv, today = inv.today();
    const rows = inv.listProducts(state.filters);
    $('#inv-body').innerHTML = rows.map(({ product: p, info }) => {
      let next = '<span class="muted">No expiry</span>';
      if (info.nextExpiry) next = `<span class="nowrap">${esc(fmtDate(info.nextExpiry))}</span><div class="sub">${dayBadge(Dates.daysBetween(today, info.nextExpiry))}</div>`;
      const [cls, label] = STATUS[info.status];
      const statusLabel = info.status === 'out' && info.expired > 0 ? 'Expired only' : label;
      const sku = esc(p.sku);
      return `
        <tr>
          <td><div class="cell-main">${esc(p.name)}</div><div class="sub muted">${esc(p.category)}</div></td>
          <td class="mono">${sku}</td>
          <td class="num"><strong>${info.sellable}</strong>${info.expired ? `<div class="sub bad">+${info.expired} expired</div>` : ''}</td>
          <td>${next}</td>
          <td><span class="badge ${cls}">${statusLabel}</span></td>
          <td class="num">${peso(p.price)}</td>
          <td class="actions">
            <button type="button" class="icon-btn" data-action="batches" data-sku="${sku}" aria-label="Manage batches of ${esc(p.name)}" title="Batches and deliveries">${icon('layers')}</button>
            <button type="button" class="icon-btn" data-action="edit" data-sku="${sku}" aria-label="Edit ${esc(p.name)}" title="Edit product">${icon('pencil')}</button>
            <button type="button" class="icon-btn danger" data-action="delete" data-sku="${sku}" aria-label="Delete ${esc(p.name)}" title="Delete product">${icon('trash')}</button>
          </td>
        </tr>`;
    }).join('');
    $('#inv-empty').hidden = rows.length !== 0;
  }

  function renderSidePanels(rep) {
    const inv = state.inv;
    $('#soon-sub').textContent = `Expired, or within ${state.warnDays} days.`;
    const rows = [...rep.expired, ...rep.soon].slice(0, 5);
    $('#soon-list').innerHTML = rows.length
      ? rows.map(r => `
          <div class="mini-row">
            <div><strong>${esc(r.product.name)}</strong><small>${r.batch.qty} pcs, ${esc(fmtDate(r.batch.expiry_date))}</small></div>
            ${dayBadge(r.daysLeft)}
          </div>`).join('')
      : '<p class="pad-msg">Nothing is close to expiring.</p>';

    const reorder = inv.reorderList().slice(0, 6);
    $('#reorder-list').innerHTML = reorder.length
      ? reorder.map(({ product: p, info }) => `
          <div class="mini-row">
            <div><strong>${esc(p.name)}</strong><small>${info.sellable} sellable, reorder at ${p.reorder_level}</small></div>
            <span class="badge ${info.status === 'out' ? 'bad' : 'warn'}">${info.status === 'out' ? 'Out' : 'Low'}</span>
          </div>`).join('')
      : '<p class="pad-msg">Every product is above its reorder level.</p>';

    $('#activity-list').innerHTML = inv.activity.length
      ? inv.activity.slice(0, 6).map(a => `<li><span>${esc(a.message)}</span><time datetime="${esc(a.time)}">${esc(new Date(a.time).toLocaleTimeString(state.config.locale, { hour: '2-digit', minute: '2-digit' }))}</time></li>`).join('')
      : '<li>No changes yet.</li>';
  }

  // ---------------------------------------------------------------- render: billing
  function cartLines() {
    // drop lines whose product no longer exists
    state.cart = state.cart.filter(l => state.inv.getProduct(l.sku));
    return state.cart.map(l => {
      const p = state.inv.getProduct(l.sku);
      return { ...l, product: p, amount: Math.round(p.price * 100) * l.qty / 100 };
    });
  }

  function renderBilling() {
    renderResults();
    renderCart();
    renderSlip();
    renderSales();
  }

  function renderResults() {
    const q = $('#b-search').value;
    const rows = state.inv.listProducts({ q });
    const shown = rows.slice(0, 40);
    $('#b-results').innerHTML = shown.map(({ product: p, info }) => `
      <button type="button" class="result" data-sku="${esc(p.sku)}" ${info.sellable === 0 ? 'disabled' : ''}>
        <span><strong>${esc(p.name)}</strong><small>${esc(p.sku)}, ${esc(p.category)}</small></span>
        <span class="right"><strong>${peso(p.price)}</strong><small>${info.sellable ? info.sellable + ' available' : (info.expired ? 'Expired only' : 'Out of stock')}</small></span>
      </button>`).join('') +
      (rows.length > shown.length ? `<p class="pad-msg muted" style="padding:12px 20px">Showing the first ${shown.length} of ${rows.length}. Narrow the search to see more.</p>` : '') +
      (rows.length === 0 ? '<div class="empty"><strong>No products found</strong>Check the spelling or try the SKU.</div>' : '');
  }

  function renderCart() {
    const lines = cartLines();
    $('#cart-body').innerHTML = lines.map(l => `
      <tr>
        <td><div class="cell-main">${esc(l.product.name)}</div><div class="sub muted mono">${esc(l.sku)}</div></td>
        <td class="num">${peso(l.product.price)}</td>
        <td class="num"><input class="qty-input" type="number" min="1" step="1" value="${l.qty}" data-sku="${esc(l.sku)}" aria-label="Quantity of ${esc(l.product.name)}"></td>
        <td class="num">${peso(l.amount)}</td>
        <td class="actions"><button type="button" class="icon-btn danger" data-remove="${esc(l.sku)}" aria-label="Remove ${esc(l.product.name)}">${icon('x')}</button></td>
      </tr>`).join('');
    $('#cart-empty').hidden = lines.length !== 0;
    const totalCents = lines.reduce((s, l) => s + Math.round(l.product.price * 100) * l.qty, 0);
    $('#cart-total').textContent = peso(totalCents / 100);
    $('#btn-checkout').disabled = lines.length === 0;
    $('#btn-clear-cart').disabled = lines.length === 0;
  }

  function currentSale() {
    const sales = state.inv.sales;
    if (state.lastSaleId != null) { const s = sales.find(x => x.id === state.lastSaleId); if (s) return s; }
    return sales[sales.length - 1] || null;
  }

  function renderSlip() {
    const sale = currentSale();
    const slip = $('#slip');
    $('#btn-print').disabled = !sale;
    if (!sale) { slip.innerHTML = '<p class="slip-empty">Complete a sale to see its itemized slip here.</p>'; return; }
    slip.innerHTML = `
      <h3>${esc(state.config.store_name)}</h3>
      <p class="center">Sales slip #${sale.id}</p>
      <p class="center">${esc(fmtTime(sale.time))}</p>
      <hr>
      ${sale.lines.map(l => `
        <div class="slip-line"><span>${l.qty} x ${esc(l.name)}</span><span>${peso(l.amount)}</span></div>
        <div class="slip-unit">@ ${peso(l.price)}</div>`).join('')}
      <hr>
      <div class="slip-total"><span>TOTAL</span><span>${peso(sale.total)}</span></div>
      <p class="slip-foot">${esc(state.config.slip_footer)}</p>`;
  }

  function renderSales() {
    const cur = currentSale();
    const recent = state.inv.sales.slice(-6).reverse();
    $('#sales-list').innerHTML = recent.length
      ? recent.map(s => `<button type="button" class="sale-row ${cur && cur.id === s.id ? 'current' : ''}" data-sale="${s.id}"><span>#${s.id}, ${esc(fmtTime(s.time))}</span><strong>${peso(s.total)}</strong></button>`).join('')
      : '<div class="empty"><strong>No sales yet</strong>Sales you complete will be listed here.</div>';
  }

  function addToCart(sku, n = 1) {
    const p = state.inv.getProduct(sku);
    if (!p) return false;
    const info = state.inv.stockInfo(p.sku);
    const line = state.cart.find(l => l.sku === p.sku);
    const have = line ? line.qty : 0;
    if (have + n > info.sellable) {
      notify(info.sellable === 0
        ? `${p.name} has no sellable stock${info.expired ? ' (only expired batches are left)' : ''}.`
        : `Only ${info.sellable} of ${p.name} available.`, 'error');
      return false;
    }
    if (line) line.qty += n; else state.cart.push({ sku: p.sku, qty: n });
    renderCart();
    return true;
  }

  function checkout() {
    const lines = cartLines();
    if (!lines.length) { notify('The cart is empty.', 'error'); return; }
    const res = state.inv.sell(lines.map(l => ({ sku: l.sku, qty: l.qty })));
    if (!res.ok) { notify(res.error, 'error'); render(); return; }
    state.cart = [];
    state.lastSaleId = res.sale.id;
    persist();
    render();
    notify(`Sale #${res.sale.id} complete: ${peso(res.sale.total)}`, 'success');
  }

  // ---------------------------------------------------------------- render: expiry watch
  function renderExpiry(rep) {
    const lossValue = rep.expired.reduce((s, r) => s + r.value, 0);
    const soonValue = rep.soon.reduce((s, r) => s + r.value, 0);
    $('#expiry-cards').innerHTML = `
      <article class="card tone-red ${rep.expired.length ? 'emphasis' : ''}"><div class="card-top"><span>Expired batches</span>${icon('alert')}</div><div class="card-value">${rep.expired.length}</div><div class="card-note">Cannot be sold</div></article>
      <article class="card tone-amber"><div class="card-top"><span>Expiring within ${state.warnDays} days</span>${icon('clock')}</div><div class="card-value">${rep.soon.length}</div><div class="card-note">${peso(soonValue)} at selling price</div></article>
      <article class="card tone-red"><div class="card-top"><span>Loss if pulled out today</span>${icon('trend')}</div><div class="card-value">${peso(lossValue)}</div><div class="card-note">At selling price, not cost</div></article>`;

    const row = r => `
      <tr>
        <td><div class="cell-main">${esc(r.product.name)}</div></td>
        <td class="mono">${esc(r.product.sku)}</td>
        <td class="num">${r.batch.qty}</td>
        <td>${esc(fmtDate(r.batch.expiry_date))}</td>
        <td>${dayBadge(r.daysLeft)}</td>
        <td class="num">${peso(r.value)}</td>
      </tr>`;
    $('#expired-body').innerHTML = rep.expired.map(row).join('');
    $('#expired-empty').hidden = rep.expired.length !== 0;
    $('#btn-pullout').disabled = rep.expired.length === 0;
    $('#soon-body').innerHTML = rep.soon.map(row).join('');
    $('#soon-empty').hidden = rep.soon.length !== 0;
    $('#warn-days').value = state.warnDays;
    $('#how-note').textContent =
      `How this list is made: all ${rep.examined} batches that have an expiry date are put into one min-heap keyed by expiry date. ` +
      `The heap gives the earliest date first, so only the ${rep.expired.length + rep.soon.length} batches inside the window are taken out. ` +
      'Selling uses the same idea: each product keeps its own heap, so the batch that expires first is always sold first.';
  }

  // ---------------------------------------------------------------- dialogs: product
  function openProduct(sku) {
    state.editSku = sku || null;
    const inv = state.inv;
    const p = sku ? inv.getProduct(sku) : null;
    $('#product-form').reset();
    $('#pd-error').hidden = true;
    $('#pd-title').textContent = p ? 'Edit product' : 'Add product';
    $('#pd-sub').textContent = p ? 'To change stock, use the batches button on the product row.' : '';
    $('#pd-save').textContent = p ? 'Save changes' : 'Save product';
    $('#pd-sku').disabled = !!p;
    ['#pd-stock-title', '#pd-qty-wrap', '#pd-exp-wrap'].forEach(s => { $(s).hidden = !!p; });
    if (p) {
      $('#pd-name').value = p.name; $('#pd-sku').value = p.sku; $('#pd-category').value = p.category;
      $('#pd-price').value = p.price; $('#pd-reorder').value = p.reorder_level;
    } else {
      $('#pd-reorder').placeholder = String(inv.defaultReorder);
    }
    $('#product-dialog').showModal();
    $('#pd-name').focus();
  }

  function submitProduct(e) {
    e.preventDefault();
    const inv = state.inv;
    const err = msg => { const el = $('#pd-error'); el.textContent = msg; el.hidden = false; };
    const data = {
      name: $('#pd-name').value, category: $('#pd-category').value,
      price: $('#pd-price').value, reorder_level: $('#pd-reorder').value
    };
    if (state.editSku) {
      const r = inv.updateProduct(state.editSku, data);
      if (!r.ok) return err(r.error);
      notify(`${r.product.name} updated.`, 'success');
    } else {
      const qtyRaw = $('#pd-qty').value, exp = $('#pd-expiry').value;
      if (qtyRaw !== '') {                       // check the delivery first so nothing is half-saved
        const c = inv.checkBatch(qtyRaw, exp);
        if (!c.ok) return err(c.error);
      }
      const r = inv.addProduct({ ...data, sku: $('#pd-sku').value });
      if (!r.ok) return err(r.error);
      if (qtyRaw !== '') inv.addBatch(r.product.sku, qtyRaw, exp);
      notify(`${r.product.name} added.`, 'success');
    }
    $('#product-dialog').close();
    persist();
    render();
  }

  async function deleteProduct(sku) {
    const p = state.inv.getProduct(sku);
    if (!p) return;
    const ok = await askConfirm(`Delete ${p.name} and all of its batches? This can't be undone.`, 'Delete product');
    if (!ok) return;
    state.inv.removeProduct(sku);
    persist();
    render();
    notify(`${p.name} deleted.`, 'success');
  }

  // ---------------------------------------------------------------- dialogs: batches
  function openBatches(sku) {
    state.batchSku = sku;
    $('#batch-form').reset();
    $('#bd-error').hidden = true;
    renderBatchDialog();
    $('#batch-dialog').showModal();
    $('#bd-qty').focus();
  }

  function renderBatchDialog() {
    const inv = state.inv, sku = state.batchSku;
    const p = inv.getProduct(sku);
    if (!p) return;
    const info = inv.stockInfo(sku), today = inv.today();
    $('#bd-title').textContent = `Batches: ${p.name}`;
    $('#bd-sub').textContent = `${p.sku}. ${info.sellable} sellable, ${info.expired} expired. Oldest expiry is sold first.`;
    const batches = inv.batchesOf(sku);
    $('#bd-body').innerHTML = batches.map(b => {
      const status = !b.expiry_date ? '<span class="badge neutral">No expiry</span>' : dayBadge(Dates.daysBetween(today, b.expiry_date));
      return `
        <tr>
          <td class="mono">#${b.id}</td>
          <td class="num">${b.qty}</td>
          <td>${b.expiry_date ? esc(fmtDate(b.expiry_date)) : '<span class="muted">None</span>'}</td>
          <td>${esc(fmtDate(b.received_date))}</td>
          <td>${status}</td>
          <td class="actions"><button type="button" class="icon-btn danger" data-batch="${b.id}" aria-label="Remove batch ${b.id}" title="Remove this batch">${icon('trash')}</button></td>
        </tr>`;
    }).join('');
    $('#bd-empty').hidden = batches.length !== 0;
  }

  function submitBatch(e) {
    e.preventDefault();
    const r = state.inv.addBatch(state.batchSku, $('#bd-qty').value, $('#bd-expiry').value);
    const el = $('#bd-error');
    if (!r.ok) { el.textContent = r.error; el.hidden = false; return; }
    el.hidden = true;
    $('#batch-form').reset();
    persist();
    renderBatchDialog();
    render();
    notify(`Received ${r.batch.qty} pcs.`, 'success');
    $('#bd-qty').focus();
  }

  async function removeBatch(id) {
    const ok = await askConfirm('Remove this batch from stock? Use this for spoiled, damaged or mistaken entries.', 'Remove batch');
    if (!ok) return;
    state.inv.removeBatch(state.batchSku, id);
    persist();
    renderBatchDialog();
    render();
  }

  // ---------------------------------------------------------------- data tools
  async function loadSample() {
    const inv = state.inv;
    const seed = await fetchJSON('data/products.json');
    if (seed) { inv.importSeed(seed); return true; }
    inv.importSeed(FALLBACK_SEED);
    showNotice("Couldn't read data/products.json (this happens when index.html is opened straight from disk), so a small built-in sample was loaded. " +
      'Use Import JSON to load data/products.json, or serve the folder, for example with: python -m http.server');
    return false;
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state.inv.toJSON(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `store-inventory-${Dates.todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function importFile(file) {
    if (!file) return;
    let obj;
    try { obj = JSON.parse(await file.text()); }
    catch (e) { notify("That file isn't valid JSON.", 'error'); return; }
    const ok = await askConfirm('Importing replaces all products, batches and sales currently in this browser. Continue?', 'Replace data');
    if (!ok) return;
    try {
      const r = state.inv.importAny(obj);
      state.cart = []; state.lastSaleId = null;
      if (state.inv.settings.expiryWarningDays) state.warnDays = state.inv.settings.expiryWarningDays;
      persist(); render();
      notify(r.errors && r.errors.length ? `Imported with ${r.errors.length} skipped row(s).` : 'Data imported.', r.errors && r.errors.length ? 'info' : 'success');
    } catch (e) { notify(e.message, 'error'); }
  }

  async function resetSample() {
    const ok = await askConfirm('Replace everything with the sample data? Your current products and sales will be lost.', 'Reset data');
    if (!ok) return;
    await loadSample();
    state.cart = []; state.lastSaleId = null;
    persist(); render();
    notify('Sample data loaded.', 'success');
  }

  // ---------------------------------------------------------------- theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#btn-theme');
    btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  // ---------------------------------------------------------------- events
  function bindEvents() {
    // navigation
    $$('.nav-item').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    $('#btn-menu').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); });
    $('#scrim').addEventListener('click', closeSidebar);
    $('#btn-theme').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      safeSet(THEME_KEY, next);
      applyTheme(next);
    });
    $('#notice-close').addEventListener('click', () => { $('#notice').hidden = true; });

    // dialogs: close buttons and backdrop clicks
    $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
    $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

    // inventory filters + table actions
    $('#f-search').addEventListener('input', e => { state.filters.q = e.target.value; renderTable(); });
    $('#f-category').addEventListener('change', e => { state.filters.category = e.target.value; renderTable(); });
    $('#f-status').addEventListener('change', e => { state.filters.status = e.target.value; renderTable(); });
    $('#btn-add-product').addEventListener('click', () => openProduct(null));
    $('#inv-body').addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const sku = btn.dataset.sku;
      if (btn.dataset.action === 'batches') openBatches(sku);
      else if (btn.dataset.action === 'edit') openProduct(sku);
      else if (btn.dataset.action === 'delete') deleteProduct(sku);
    });
    $('#product-form').addEventListener('submit', submitProduct);

    // batches dialog
    $('#batch-form').addEventListener('submit', submitBatch);
    $('#bd-body').addEventListener('click', e => {
      const btn = e.target.closest('button[data-batch]');
      if (btn) removeBatch(Number(btn.dataset.batch));
    });

    // billing
    $('#b-sku').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const v = e.target.value.trim();
      if (!v) return;
      const p = state.inv.getProduct(v);                 // hash-table lookup, O(1)
      if (!p) { notify(`No product has the SKU "${v.toUpperCase()}".`, 'error'); return; }
      if (addToCart(p.sku, 1)) e.target.value = '';
    });
    $('#b-search').addEventListener('input', renderResults);
    $('#b-results').addEventListener('click', e => {
      const btn = e.target.closest('button[data-sku]');
      if (btn) addToCart(btn.dataset.sku, 1);
    });
    $('#cart-body').addEventListener('change', e => {
      const input = e.target.closest('input.qty-input');
      if (!input) return;
      const line = state.cart.find(l => l.sku === input.dataset.sku);
      if (!line) return;
      const max = state.inv.stockInfo(line.sku).sellable;
      let q = parseInt(input.value, 10);
      if (!Number.isInteger(q) || q < 1) q = 1;
      if (max < 1) state.cart = state.cart.filter(l => l !== line);
      else {
        if (q > max) { q = max; notify(`Only ${max} available.`, 'error'); }
        line.qty = q;
      }
      renderCart();
    });
    $('#cart-body').addEventListener('click', e => {
      const btn = e.target.closest('button[data-remove]');
      if (!btn) return;
      state.cart = state.cart.filter(l => l.sku !== btn.dataset.remove);
      renderCart();
    });
    $('#btn-clear-cart').addEventListener('click', () => { state.cart = []; renderCart(); });
    $('#btn-checkout').addEventListener('click', checkout);
    $('#btn-print').addEventListener('click', () => window.print());
    $('#sales-list').addEventListener('click', e => {
      const btn = e.target.closest('button[data-sale]');
      if (!btn) return;
      state.lastSaleId = Number(btn.dataset.sale);
      renderSlip(); renderSales();
    });

    // expiry watch
    $('#warn-days').addEventListener('change', e => {
      let d = parseInt(e.target.value, 10);
      if (!Number.isInteger(d) || d < 1) d = 1;
      if (d > 365) d = 365;
      state.warnDays = d;
      persist();
      render();
    });
    $('#btn-pullout').addEventListener('click', async () => {
      const n = state.report.expired.length;
      if (!n) return;
      const ok = await askConfirm(`Pull out ${n} expired batch(es)? They will be removed from stock.`, 'Pull out');
      if (!ok) return;
      const r = state.inv.pullOutExpired();
      persist(); render();
      notify(`Pulled out ${r.qty} pcs. Estimated loss ${peso(r.loss)}.`, 'success');
    });

    // data tools
    $('#btn-export').addEventListener('click', exportJSON);
    $('#btn-import').addEventListener('click', () => $('#file-import').click());
    $('#file-import').addEventListener('change', e => { importFile(e.target.files[0]); e.target.value = ''; });
    $('#btn-reset').addEventListener('click', resetSample);
  }

  // ---------------------------------------------------------------- start-up
  async function init() {
    renderIcons();
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

    const cfg = await fetchJSON('data/config.json');
    state.config = { ...DEFAULT_CONFIG, ...(cfg || {}) };
    try { state.fmt = new Intl.NumberFormat(state.config.locale, { style: 'currency', currency: state.config.currency }); }
    catch (e) { state.fmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }); }

    state.inv = new Inventory({ defaultReorder: state.config.default_reorder_level });
    $('#brand-name').textContent = state.config.store_name;
    document.title = `${state.config.store_name}: inventory`;
    $('#today-label').textContent = new Date().toLocaleDateString(state.config.locale, { weekday: 'long', month: 'long', day: 'numeric' });

    let loaded = false;
    const saved = safeGet(state.config.storage_key);
    if (saved) {
      try { state.inv.load(JSON.parse(saved)); loaded = true; }
      catch (e) { notify("Saved data couldn't be read, so the sample data was loaded.", 'error'); }
    }
    if (!loaded) { await loadSample(); persist(); }

    state.warnDays = Number(state.inv.settings.expiryWarningDays) || state.config.expiry_warning_days;
    bindEvents();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
