/*
 * app.js
 * ---------------------------------------------------------------
 * The user interface. All rules live in inventory.js; this file only
 * reads the user's input, calls the Inventory, and draws the result.
 *
 * Guidelines followed when extending:
 *  - Keep business rules out of the UI (call Inventory methods only).
 *  - Preserve FEFO / Map+MinHeap behaviour; never sell expired stock.
 *  - New views (Utang, Finance, Alerts) mirror existing panel patterns.
 *  - Payment mode is chosen BEFORE sale is committed (checkout dialog).
 *  - Refunds restock and adjust utang balances via Inventory.refund().
 *  - Sidebar collapse state and theme are persisted in localStorage.
 */
(() => {
  'use strict';

  const { Inventory, Dates } = window.InventoryLib;
  const Calculator = window.Calculator;

  // ---------------------------------------------------------------- config
  const DEFAULT_CONFIG = {
    store_name: 'Store Inventory',
    store_tagline: 'Mini-grocery POS',
    currency: 'PHP',
    locale: 'en-PH',
    expiry_warning_days: 14,
    default_reorder_level: 5,
    storage_key: 'store-inventory-v3',
    slip_footer: 'Thank you! This is a sales slip, not an official BIR receipt.'
  };
  const THEME_KEY = 'si-theme';
  const PALETTE_KEY = 'si-palette';
  const CUSTOM_HEX_KEY = 'si-custom-hex';
  const CHART_TYPE_KEY = 'si-chart-type';
  const COLLAPSE_KEY = 'si-sidebar-collapsed';
  const STORE_META_KEY = 'si-store-meta';

  const PALETTES = {
    blue:    { brand: '#2563eb', soft: '#e8f0ff', strong: '#1d4ed8', darkBrand: '#6ea8ff', darkSoft: '#182b4d', darkStrong: '#93c5fd' },
    emerald: { brand: '#059669', soft: '#d1fae5', strong: '#047857', darkBrand: '#34d399', darkSoft: '#0f2f24', darkStrong: '#6ee7b7' },
    violet:  { brand: '#7c3aed', soft: '#ede9fe', strong: '#6d28d9', darkBrand: '#a78bfa', darkSoft: '#2a1f4a', darkStrong: '#c4b5fd' },
    amber:   { brand: '#d97706', soft: '#fef3c7', strong: '#b45309', darkBrand: '#fbbf24', darkSoft: '#3a2b08', darkStrong: '#fcd34d' },
    rose:    { brand: '#e11d48', soft: '#ffe4e6', strong: '#be123c', darkBrand: '#fb7185', darkSoft: '#3f1520', darkStrong: '#fda4af' },
    slate:   { brand: '#475569', soft: '#e2e8f0', strong: '#334155', darkBrand: '#94a3b8', darkSoft: '#1e293b', darkStrong: '#cbd5e1' }
  };

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
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    trend: '<path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"/><path d="m2 7 8 8 4-4 8 8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'
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
    utangFilters: { q: '', status: '' },
    cart: [],
    lastSaleId: null,
    warnDays: 14,
    editSku: null,
    batchSku: null,
    refundSaleId: null,
    payUtangId: null,
    extendUtangId: null,
    report: null,
    fmt: null,
    storageWarned: false,
    collapsed: false,
    calcOpen: false,
    notifOpen: false,
    dismissedNotifs: new Set(),
    highlight: null,   // { view, sku?, utangId?, kind }
    chartType: 'bar',
    palette: 'blue',
    customHex: '#2563eb'
  };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const peso = n => state.fmt.format(n);
  const safeGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

  function fmtDate(str) {
    if (!str) return '—';
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
  const UTANG_STATUS = {
    open: ['info', 'Open'],
    partial: ['warn', 'Partial'],
    paid: ['ok', 'Paid'],
    overdue: ['bad', 'Overdue']
  };

  function dayBadge(d) {
    if (d < 0) return `<span class="badge bad">Expired ${-d}d ago</span>`;
    if (d === 0) return '<span class="badge warn">Expires today</span>';
    if (d <= state.warnDays) return `<span class="badge warn">${d}d left</span>`;
    return `<span class="badge neutral">${d}d left</span>`;
  }

  // ---------------------------------------------------------------- render: shell
  const TITLES = {
    inventory: 'Inventory',
    billing: 'Billing',
    expiry: 'Expiry',
    utang: 'Utang',
    finance: 'Finance'
  };
  const DISMISS_KEY = 'si-dismissed-notifs';

  function setView(view) {
    state.view = view;
    $$('.view').forEach(v => { v.hidden = v.id !== `view-${view}`; });
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $('#page-title').textContent = TITLES[view] || view;
    closeSidebar();
    render();
    if (view === 'billing') $('#b-sku').focus();
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('open');
    $('#scrim').classList.remove('show');
  }

  function applyCollapse(collapsed) {
    state.collapsed = !!collapsed;
    document.getElementById('app-shell').classList.toggle('sidebar-collapsed', state.collapsed);
    const btn = $('#btn-collapse');
    if (btn) {
      btn.setAttribute('aria-label', state.collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.title = state.collapsed ? 'Expand sidebar' : 'Collapse sidebar';
      btn.innerHTML = icon(state.collapsed ? 'chevron-right' : 'chevron-left');
    }
    safeSet(COLLAPSE_KEY, state.collapsed ? '1' : '0');
    requestAnimationFrame(updateBrandMarquees);
  }

  function loadDismissed() {
    try {
      const raw = safeGet(DISMISS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      state.dismissedNotifs = new Set(Array.isArray(arr) ? arr : []);
    } catch (e) { state.dismissedNotifs = new Set(); }
  }
  function saveDismissed() {
    safeSet(DISMISS_KEY, JSON.stringify([...state.dismissedNotifs]));
  }

  function notifKey(n) {
    if (n.type === 'low_stock' || n.type === 'near_expiry' || n.type === 'expired') {
      return `${n.type}:${n.sku}:${n.expiry || n.sellable || ''}`;
    }
    if (n.type === 'utang_due' || n.type === 'utang_overdue') {
      return `${n.type}:${n.id}:${n.due_date || ''}`;
    }
    return `${n.type}:${JSON.stringify(n)}`;
  }

  function activeNotifications() {
    const notes = state.inv.notifications(state.warnDays);
    const list = [];
    notes.low_stock.forEach(x => list.push({ ...x, _key: notifKey(x) }));
    notes.near_expiry.forEach(x => list.push({ ...x, _key: notifKey(x) }));
    notes.expired.forEach(x => list.push({ ...x, _key: notifKey(x) }));
    notes.utang_deadlines.forEach(x => list.push({ ...x, _key: notifKey(x) }));
    return list.filter(n => !state.dismissedNotifs.has(n._key));
  }

  function updateNavBadges() {
    const notes = state.inv.notifications(state.warnDays);
    const expN = notes.expired.length + notes.near_expiry.length;
    const badge = $('#nav-expiry-badge');
    if (badge) {
      badge.hidden = expN === 0;
      badge.textContent = expN;
    }

    const overdue = notes.utang_deadlines.filter(u => u.type === 'utang_overdue').length;
    const openU = state.inv.listUtangs({ status: 'open' }).length;
    const ub = $('#nav-utang-badge');
    if (ub) {
      ub.hidden = openU === 0;
      ub.textContent = openU;
      ub.classList.toggle('warn', overdue === 0);
      ub.classList.toggle('bad', overdue > 0);
    }

    const active = activeNotifications();
    const total = active.length;
    const dot = $('#top-alert-dot');
    const count = $('#top-alert-count');
    if (dot) dot.hidden = total === 0;
    if (count) {
      count.hidden = total === 0;
      count.textContent = total > 99 ? '99+' : String(total);
    }
    if (state.notifOpen) renderNotifPanel();
  }

  function setNotifOpen(open) {
    state.notifOpen = !!open;
    const panel = $('#notif-panel');
    const btn = $('#btn-notif-quick');
    if (panel) panel.hidden = !state.notifOpen;
    if (btn) btn.setAttribute('aria-expanded', state.notifOpen ? 'true' : 'false');
    if (state.notifOpen) renderNotifPanel();
  }

  function renderNotifPanel() {
    const body = $('#notif-panel-body');
    if (!body) return;
    const list = activeNotifications();
    if (!list.length) {
      body.innerHTML = '<p class="notif-empty">There are currently no notifications</p>';
      return;
    }
    body.innerHTML = list.map(n => {
      let title = '', detail = '', tone = 'warn';
      if (n.type === 'low_stock') {
        title = n.status === 'out' ? 'Out of stock' : 'Low stock';
        detail = `${n.name} · ${n.sellable} sellable (reorder ${n.reorder})`;
        tone = n.status === 'out' ? 'bad' : 'warn';
      } else if (n.type === 'near_expiry') {
        title = 'Near expiry';
        detail = `${n.name} · ${n.qty} pcs · ${fmtDate(n.expiry)} · ${n.daysLeft}d left`;
        tone = 'warn';
      } else if (n.type === 'expired') {
        title = 'Expired on shelf';
        detail = `${n.name} · ${n.qty} pcs · ${fmtDate(n.expiry)}`;
        tone = 'bad';
      } else if (n.type === 'utang_overdue') {
        title = 'Utang overdue';
        detail = `${n.customer} · ${peso(n.remaining)} · due ${fmtDate(n.due_date)}`;
        tone = 'bad';
      } else {
        title = 'Utang due soon';
        detail = `${n.customer} · ${peso(n.remaining)} · due ${fmtDate(n.due_date)}`;
        tone = 'warn';
      }
      return `
        <div class="notif-item tone-${tone}" data-notif-key="${esc(n._key)}" data-notif-type="${esc(n.type)}"
             data-sku="${esc(n.sku || '')}" data-utang-id="${n.id != null ? n.id : ''}" role="button" tabindex="0">
          <div class="notif-item-main">
            <strong>${esc(title)}</strong>
            <span class="notif-detail">${esc(detail)}</span>
          </div>
          <button type="button" class="icon-btn notif-dismiss desktop-only" data-dismiss-notif="${esc(n._key)}" aria-label="Dismiss">${icon('x')}</button>
        </div>`;
    }).join('');
    bindNotifSwipe(body);
  }

  function bindNotifSwipe(root) {
    root.querySelectorAll('.notif-item').forEach(el => {
      let startX = 0, dx = 0, tracking = false;
      el.addEventListener('touchstart', e => {
        if (!e.touches[0]) return;
        startX = e.touches[0].clientX;
        dx = 0;
        tracking = true;
        el.classList.add('swiping');
      }, { passive: true });
      el.addEventListener('touchmove', e => {
        if (!tracking || !e.touches[0]) return;
        dx = e.touches[0].clientX - startX;
        if (dx < 0) el.style.transform = `translateX(${Math.max(dx, -120)}px)`;
      }, { passive: true });
      el.addEventListener('touchend', () => {
        tracking = false;
        el.classList.remove('swiping');
        if (dx < -64) {
          dismissNotif(el.dataset.notifKey);
        } else {
          el.style.transform = '';
        }
        dx = 0;
      });
    });
  }

  function dismissNotif(key) {
    if (!key) return;
    state.dismissedNotifs.add(key);
    saveDismissed();
    updateNavBadges();
    renderNotifPanel();
  }

  function goToNotif(n) {
    setNotifOpen(false);
    const type = n.type;
    if (type === 'low_stock') {
      state.highlight = { view: 'inventory', sku: n.sku, kind: 'low_stock' };
      state.filters.status = n.status === 'out' ? 'out' : 'low';
      setView('inventory');
    } else if (type === 'near_expiry' || type === 'expired') {
      state.highlight = { view: 'expiry', sku: n.sku, kind: type };
      setView('expiry');
    } else if (type === 'utang_due' || type === 'utang_overdue') {
      state.highlight = { view: 'utang', utangId: Number(n.id), kind: type };
      state.utangFilters.status = type === 'utang_overdue' ? 'overdue' : 'open';
      setView('utang');
    }
    // clear highlight after a few seconds
    setTimeout(() => {
      state.highlight = null;
      document.querySelectorAll('.row-highlight').forEach(r => r.classList.remove('row-highlight'));
    }, 4500);
  }

  function applyHighlight() {
    const h = state.highlight;
    if (!h) return;
    requestAnimationFrame(() => {
      let el = null;
      if (h.sku) {
        const safe = String(h.sku).replace(/"/g, '\\"');
        el = document.querySelector(`[data-row-sku="${safe}"]`);
      }
      if (h.utangId != null) el = document.querySelector(`[data-row-utang="${h.utangId}"]`);
      if (el) {
        el.classList.add('row-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function render() {
    const rep = state.inv.expiryReport(state.warnDays);
    state.report = rep;
    updateNavBadges();
    if (state.view === 'inventory') renderInventory(rep);
    else if (state.view === 'billing') renderBilling();
    else if (state.view === 'expiry') renderExpiry(rep);
    else if (state.view === 'utang') renderUtang();
    else if (state.view === 'finance') renderFinance();
    applyHighlight();
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
    const hlSku = state.highlight && state.highlight.view === 'inventory' ? state.highlight.sku : null;
    $('#inv-body').innerHTML = rows.map(({ product: p, info }) => {
      let next = '<span class="muted">No expiry</span>';
      if (info.nextExpiry) next = `<span class="nowrap">${esc(fmtDate(info.nextExpiry))}</span><div class="sub">${dayBadge(Dates.daysBetween(today, info.nextExpiry))}</div>`;
      const [cls, label] = STATUS[info.status];
      const statusLabel = info.status === 'out' && info.expired > 0 ? 'Expired only' : label;
      const sku = esc(p.sku);
      const hl = hlSku && hlSku === p.sku ? ' row-highlight' : '';
      return `
        <tr class="product-row${hl}" data-row-sku="${sku}">
          <td class="col-product">
            <div class="product-cell">
              <div class="product-avatar" aria-hidden="true">${esc((p.name || '?').charAt(0).toUpperCase())}</div>
              <div class="product-meta">
                <div class="cell-main">${esc(p.name)}</div>
                <div class="sub muted"><span class="cat-chip">${esc(p.category)}</span> · <span class="mono">${sku}</span></div>
              </div>
            </div>
          </td>
          <td class="num col-stock">
            <strong class="stock-num">${info.sellable}</strong>
            ${info.expired ? `<div class="sub bad">+${info.expired} expired</div>` : '<div class="sub muted">sellable</div>'}
          </td>
          <td class="col-expiry">${next}</td>
          <td class="col-status"><span class="badge ${cls}">${statusLabel}</span></td>
          <td class="num col-price">${peso(p.price)}</td>
          <td class="actions col-actions">
            <button type="button" class="icon-btn" data-action="batches" data-sku="${sku}" aria-label="Manage batches of ${esc(p.name)}" title="Batches">${icon('layers')}</button>
            <button type="button" class="icon-btn" data-action="edit" data-sku="${sku}" aria-label="Edit ${esc(p.name)}" title="Edit">${icon('pencil')}</button>
            <button type="button" class="icon-btn danger" data-action="delete" data-sku="${sku}" aria-label="Delete ${esc(p.name)}" title="Delete">${icon('trash')}</button>
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

    const reorder = inv.reorderList().slice(0, 8);
    $('#reorder-list').innerHTML = reorder.length
      ? reorder.map(({ product: p, info }) => `
          <div class="mini-row">
            <div><strong>${esc(p.name)}</strong><small>${info.sellable} sellable, reorder at ${p.reorder_level}</small></div>
            <span class="badge ${info.status === 'out' ? 'bad' : 'warn'}">${info.status === 'out' ? 'Out' : 'Low'}</span>
          </div>`).join('')
      : '<p class="pad-msg">Every product is above its reorder level.</p>';

    const act = inv.activity.slice(0, 8);
    $('#activity-list').innerHTML = act.length
      ? act.map(a => `<li><span>${esc(a.message)}</span><time>${esc(fmtTime(a.time))}</time></li>`).join('')
      : '<li class="muted">No activity yet.</li>';
  }

  function printReorderList() {
    const list = state.inv.reorderList();
    const store = state.config.store_name;
    const today = new Date().toLocaleDateString(state.config.locale, { dateStyle: 'full' });
    let html = `
      <div class="print-sheet">
        <h1>${esc(store)} — Reorder list</h1>
        <p>Printed ${esc(today)}</p>
        <table>
          <thead><tr><th>Product</th><th>SKU</th><th>Sellable</th><th>Reorder at</th><th>Status</th><th>Price</th></tr></thead>
          <tbody>`;
    if (!list.length) {
      html += '<tr><td colspan="6">All products are above reorder level.</td></tr>';
    } else {
      for (const { product: p, info } of list) {
        html += `<tr>
          <td>${esc(p.name)}</td><td>${esc(p.sku)}</td>
          <td class="num">${info.sellable}</td><td class="num">${p.reorder_level}</td>
          <td>${info.status === 'out' ? 'Out of stock' : 'Low stock'}</td>
          <td class="num">${peso(p.price)}</td>
        </tr>`;
      }
    }
    html += '</tbody></table></div>';
    const el = $('#print-reorder');
    el.innerHTML = html;
    el.hidden = false;
    window.print();
    setTimeout(() => { el.hidden = true; el.innerHTML = ''; }, 500);
  }

  // ---------------------------------------------------------------- render: billing
  function renderBilling() {
    renderCart();
    renderResults($('#b-search').value);
    renderSlip();
    renderSales();
  }

  function renderResults(q) {
    const query = (q || '').trim().toLowerCase();
    const rows = state.inv.listProducts({ q: query }).slice(0, 12);
    $('#b-results').innerHTML = rows.length
      ? rows.map(({ product: p, info }) => `
          <button type="button" class="result-row" data-sku="${esc(p.sku)}" ${info.sellable <= 0 ? 'disabled' : ''}>
            <div><strong>${esc(p.name)}</strong><small>${esc(p.sku)} · ${info.sellable} sellable</small></div>
            <span class="num">${peso(p.price)}</span>
          </button>`).join('')
      : '<p class="pad-msg">No matching products.</p>';
  }

  function renderCart() {
    const body = $('#cart-body');
    if (!state.cart.length) {
      body.innerHTML = '';
      $('#cart-empty').hidden = false;
      $('#cart-total').textContent = peso(0);
      return;
    }
    $('#cart-empty').hidden = true;
    let total = 0;
    body.innerHTML = state.cart.map((line, i) => {
      const amt = line.price * line.qty;
      total += amt;
      return `<tr>
        <td>${esc(line.name)}<div class="sub muted">${esc(line.sku)}</div></td>
        <td class="num">${peso(line.price)}</td>
        <td class="num">
          <div class="qty-ctrl">
            <button type="button" data-cart-dec="${i}" aria-label="Decrease">−</button>
            <span>${line.qty}</span>
            <button type="button" data-cart-inc="${i}" aria-label="Increase">+</button>
          </div>
        </td>
        <td class="num">${peso(amt)}</td>
        <td><button type="button" class="icon-btn danger" data-cart-rm="${i}" aria-label="Remove">${icon('x')}</button></td>
      </tr>`;
    }).join('');
    $('#cart-total').textContent = peso(total);
  }

  function addToCart(sku, qty = 1) {
    const p = state.inv.getProduct(sku);
    if (!p) return notify('Product not found.', 'error');
    const info = state.inv.stockInfo(sku);
    if (info.sellable <= 0) return notify(`${p.name} has no sellable stock.`, 'error');
    const existing = state.cart.find(c => c.sku === p.sku);
    const nextQty = (existing ? existing.qty : 0) + qty;
    if (nextQty > info.sellable) return notify(`Only ${info.sellable} sellable of ${p.name}.`, 'error');
    if (existing) existing.qty = nextQty;
    else state.cart.push({ sku: p.sku, name: p.name, price: p.price, qty });
    renderCart();
    notify(`Added ${p.name}`, 'success');
  }

  function openCheckout() {
    if (!state.cart.length) return notify('Cart is empty.', 'error');
    let total = 0;
    state.cart.forEach(c => { total += c.price * c.qty; });
    $('#co-total').textContent = peso(total);
    $('#co-error').hidden = true;
    $('#checkout-form').reset();
    $$('input[name="pay-mode"]').forEach(r => { if (r.value === 'cash') r.checked = true; });
    $('#utang-fields').hidden = true;
    const due = Dates.addDays(state.inv.today(), 7);
    $('#co-due').value = due;
    $('#checkout-dialog').showModal();
  }

  function submitCheckout(e) {
    e.preventDefault();
    const mode = ($('input[name="pay-mode"]:checked') || {}).value || 'cash';
    const err = msg => { const el = $('#co-error'); el.textContent = msg; el.hidden = false; };
    const opts = { payment_mode: mode };
    if (mode === 'utang') {
      opts.customer = $('#co-customer').value;
      opts.due_date = $('#co-due').value || null;
      opts.note = $('#co-note').value;
    }
    const r = state.inv.sell(state.cart.map(c => ({ sku: c.sku, qty: c.qty })), opts);
    if (!r.ok) return err(r.error);
    state.cart = [];
    state.lastSaleId = r.sale.id;
    $('#checkout-dialog').close();
    persist();
    render();
    notify(mode === 'utang'
      ? `Sale #${r.sale.id} recorded as utang for ${r.sale.customer}.`
      : `Sale #${r.sale.id} completed (cash).`, 'success');
  }

  function renderSlip() {
    const sale = state.inv.sales.find(s => s.id === state.lastSaleId) || state.inv.sales.filter(s => !s.is_refund).slice(-1)[0];
    const el = $('#slip');
    const btn = $('#btn-print');
    if (!sale) {
      el.innerHTML = '<p class="pad-msg">Complete a sale to see the slip.</p>';
      btn.disabled = true;
      return;
    }
    btn.disabled = false;
    const modeLabel = sale.is_refund ? 'REFUND' : (sale.payment_mode === 'utang' ? 'UTANG' : 'CASH');
    const itemCount = sale.lines.reduce((n, l) => n + l.qty, 0);
    el.innerHTML = `
      <div class="slip-inner" id="slip-print-root">
        <div class="slip-brand">${esc(state.config.store_name)}</div>
        <div class="slip-rule"></div>
        <div class="slip-head-row">
          <span>Slip #${sale.id}${sale.is_refund ? ` · REF of #${sale.original_sale_id}` : ''}</span>
          <span class="slip-mode">${modeLabel}</span>
        </div>
        <div class="slip-datetime">${esc(fmtTime(sale.time))}</div>
        ${sale.customer ? `<div class="slip-customer">Customer: <strong>${esc(sale.customer)}</strong></div>` : ''}
        ${sale.due_date && !sale.is_refund ? `<div class="slip-due">Due: ${esc(fmtDate(sale.due_date))}</div>` : ''}
        <div class="slip-rule dashed"></div>
        <table class="slip-table">
          <thead>
            <tr><th class="slip-col-item">Item</th><th class="num slip-col-qty">Qty</th><th class="num slip-col-amt">Amount</th></tr>
          </thead>
          <tbody>
            ${sale.lines.map(l => `
              <tr>
                <td class="slip-col-item">
                  <div class="slip-item-name">${esc(l.name)}</div>
                  <div class="slip-item-meta">${esc(l.sku)} · ${peso(l.price)} ea</div>
                </td>
                <td class="num slip-col-qty">${l.qty}</td>
                <td class="num slip-col-amt">${peso(Math.abs(l.amount))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="slip-rule dashed"></div>
        <div class="slip-total-row">
          <span>${itemCount} item(s)</span>
          <strong>${peso(sale.total)}</strong>
        </div>
        ${sale.reason ? `<div class="slip-reason">Reason: ${esc(sale.reason)}</div>` : ''}
        <div class="slip-rule"></div>
        <p class="slip-foot">${esc(state.config.slip_footer)}</p>
      </div>`;
  }

  function renderSales() {
    const list = state.inv.sales.slice().reverse().slice(0, 15);
    $('#sales-list').innerHTML = list.length
      ? list.map(s => {
          const mode = s.is_refund ? 'Refund' : (s.payment_mode === 'utang' ? 'Utang' : 'Cash');
          const cls = s.is_refund ? 'neutral' : (s.payment_mode === 'utang' ? 'warn' : 'ok');
          return `<div class="sale-row">
            <div>
              <strong>#${s.id}</strong>
              <span class="badge ${cls}">${mode}</span>
              ${s.customer ? `<span class="muted">${esc(s.customer)}</span>` : ''}
              <div class="sub muted">${esc(fmtTime(s.time))} · ${s.lines.reduce((n, l) => n + l.qty, 0)} items</div>
            </div>
            <div class="sale-actions">
              <strong class="${s.total < 0 ? 'bad' : ''}">${peso(s.total)}</strong>
              ${!s.is_refund && !s.refunded ? `<button type="button" class="btn ghost small" data-refund="${s.id}" title="Refund / return">${icon('undo')} Refund</button>` : ''}
              <button type="button" class="btn ghost small" data-view-sale="${s.id}">Slip</button>
            </div>
          </div>`;
        }).join('')
      : '<p class="pad-msg">No sales yet.</p>';
  }

  function openRefund(saleId) {
    const sale = state.inv.sales.find(s => s.id === Number(saleId));
    if (!sale || sale.is_refund || sale.refunded) return;
    state.refundSaleId = sale.id;
    $('#rf-sub').textContent = `Sale #${sale.id}${sale.customer ? ' · ' + sale.customer : ''} · ${peso(sale.total)}`;
    $('#rf-reason').value = '';
    $('#rf-error').hidden = true;

    // compute already refunded qty per sku
    const already = new Map();
    for (const rid of (sale.refund_ids || [])) {
      const prev = state.inv.sales.find(s => s.id === rid && s.is_refund);
      if (prev) for (const ln of prev.lines) already.set(ln.sku, (already.get(ln.sku) || 0) + ln.qty);
    }

    $('#rf-body').innerHTML = sale.lines.map(l => {
      const max = l.qty - (already.get(l.sku) || 0);
      if (max <= 0) return '';
      return `<tr>
        <td>${esc(l.name)}<div class="sub muted">${esc(l.sku)}</div></td>
        <td class="num">${l.qty}</td>
        <td class="num"><input type="number" min="0" max="${max}" step="1" value="0" data-rf-sku="${esc(l.sku)}" data-rf-max="${max}" class="rf-qty"></td>
      </tr>`;
    }).filter(Boolean).join('') || '<tr><td colspan="3">Nothing left to refund on this sale.</td></tr>';

    $('#refund-dialog').showModal();
  }

  function submitRefund(e) {
    e.preventDefault();
    const err = msg => { const el = $('#rf-error'); el.textContent = msg; el.hidden = false; };
    const items = [];
    $$('.rf-qty').forEach(inp => {
      const q = parseInt(inp.value, 10) || 0;
      if (q > 0) items.push({ sku: inp.dataset.rfSku, qty: q });
    });
    if (!items.length) return err('Enter at least one quantity to return.');
    const r = state.inv.refund(state.refundSaleId, items, { reason: $('#rf-reason').value });
    if (!r.ok) return err(r.error);
    state.lastSaleId = r.refund.id;
    $('#refund-dialog').close();
    persist();
    render();
    notify(`Refund processed. ${items.reduce((s, i) => s + i.qty, 0)} item(s) restocked.`, 'success');
  }

  // ---------------------------------------------------------------- render: expiry
  function renderExpiry(rep) {
    const s = state.inv.summary(rep);
    $('#expiry-cards').innerHTML = [
      { label: 'Expired batches', value: s.expiredBatches, tone: 'red', note: peso(s.expiredValue) },
      { label: 'Expiring soon', value: s.soonBatches, tone: 'amber', note: `Within ${state.warnDays} days` },
      { label: 'Products', value: s.products, tone: '', note: 'In catalog' }
    ].map(c => `
      <article class="card ${c.tone ? 'tone-' + c.tone : ''}">
        <div class="card-top"><span>${c.label}</span></div>
        <div class="card-value">${c.value}</div>
        <div class="card-note">${c.note}</div>
      </article>`).join('');

    $('#warn-days').value = state.warnDays;
    const hlSku = state.highlight && state.highlight.view === 'expiry' ? state.highlight.sku : null;
    $('#expired-body').innerHTML = rep.expired.map(r => {
      const sku = esc(r.product.sku);
      const hl = hlSku === r.product.sku ? ' row-highlight' : '';
      return `
      <tr class="${hl}" data-row-sku="${sku}">
        <td>${esc(r.product.name)}</td><td class="mono">${sku}</td>
        <td class="num">${r.batch.qty}</td><td>${esc(fmtDate(r.batch.expiry_date))}</td>
        <td>${dayBadge(r.daysLeft)}</td><td class="num">${peso(r.value)}</td>
      </tr>`;
    }).join('');
    $('#expired-empty').hidden = rep.expired.length !== 0;

    $('#soon-body').innerHTML = rep.soon.map(r => {
      const sku = esc(r.product.sku);
      const hl = hlSku === r.product.sku ? ' row-highlight' : '';
      return `
      <tr class="${hl}" data-row-sku="${sku}">
        <td>${esc(r.product.name)}</td><td class="mono">${sku}</td>
        <td class="num">${r.batch.qty}</td><td>${esc(fmtDate(r.batch.expiry_date))}</td>
        <td>${dayBadge(r.daysLeft)}</td><td class="num">${peso(r.value)}</td>
      </tr>`;
    }).join('');
    $('#soon-empty').hidden = rep.soon.length !== 0;
    $('#how-note').textContent = `Examined ${rep.examined} dated batch(es). FEFO heap keeps the earliest expiry on top.`;
  }

  // ---------------------------------------------------------------- render: utang
  function renderUtang() {
    const fin = state.inv.financeSummary();
    $('#utang-cards').innerHTML = [
      { label: 'Outstanding', value: peso(fin.outstandingUtang), tone: 'amber', note: `${fin.openUtangs} open record(s)` },
      { label: 'Overdue', value: fin.overdueUtangs, tone: 'red', note: 'Past due date', emphasis: fin.overdueUtangs > 0 },
      { label: 'Collected', value: peso(fin.utangCollected), tone: 'green', note: 'Payments received' },
      { label: 'Created (all time)', value: peso(fin.utangCreated), tone: '', note: 'Total credit extended' }
    ].map(c => `
      <article class="card ${c.tone ? 'tone-' + c.tone : ''} ${c.emphasis ? 'emphasis' : ''}">
        <div class="card-top"><span>${c.label}</span></div>
        <div class="card-value">${c.value}</div>
        <div class="card-note">${c.note}</div>
      </article>`).join('');

    const rows = state.inv.listUtangs(state.utangFilters);
    const hlId = state.highlight && state.highlight.view === 'utang' ? state.highlight.utangId : null;
    $('#utang-body').innerHTML = rows.map(u => {
      const [cls, label] = UTANG_STATUS[u.effective_status] || UTANG_STATUS.open;
      const hl = hlId === u.id ? ' row-highlight' : '';
      return `<tr class="${hl}" data-row-utang="${u.id}">
        <td class="mono">#${u.id}</td>
        <td><strong>${esc(u.customer)}</strong>${u.note ? `<div class="sub muted">${esc(u.note)}</div>` : ''}</td>
        <td class="mono">#${u.sale_id}</td>
        <td class="num">${peso(u.amount)}</td>
        <td class="num"><strong>${peso(u.remaining)}</strong></td>
        <td>${esc(fmtDate(u.due_date))}${u.daysLeft != null ? `<div class="sub">${dayBadge(u.daysLeft)}</div>` : ''}</td>
        <td><span class="badge ${cls}">${label}</span></td>
        <td class="actions">
          ${u.status !== 'paid' ? `
            <div class="action-row">
              <button type="button" class="btn ghost small" data-pay-utang="${u.id}">${icon('check')} Pay</button>
              <button type="button" class="btn ghost small" data-extend-utang="${u.id}">${icon('calendar')} Extend</button>
            </div>` : ''}
        </td>
      </tr>`;
    }).join('');
    $('#utang-empty').hidden = rows.length !== 0;
  }

  function openPayUtang(id) {
    const u = state.inv.utangs.find(x => x.id === Number(id));
    if (!u || u.status === 'paid') return;
    state.payUtangId = u.id;
    $('#pu-sub').textContent = `${u.customer} · remaining ${peso(u.remaining)}`;
    $('#pu-amount').value = u.remaining;
    $('#pu-amount').max = u.remaining;
    $('#pu-note').value = '';
    $('#pu-error').hidden = true;
    $('#pay-utang-dialog').showModal();
    $('#pu-amount').focus();
  }

  function submitPayUtang(e) {
    e.preventDefault();
    const err = msg => { const el = $('#pu-error'); el.textContent = msg; el.hidden = false; };
    const r = state.inv.payUtang(state.payUtangId, $('#pu-amount').value, $('#pu-note').value);
    if (!r.ok) return err(r.error);
    $('#pay-utang-dialog').close();
    persist();
    render();
    notify(r.utang.status === 'paid' ? `Utang #${r.utang.id} fully paid.` : `Payment recorded. Remaining ${peso(r.utang.remaining)}.`, 'success');
  }

  function openExtendUtang(id) {
    const u = state.inv.utangs.find(x => x.id === Number(id));
    if (!u || u.status === 'paid') return;
    state.extendUtangId = u.id;
    const suggested = Dates.addDays(
      (u.due_date && u.due_date > state.inv.today() ? u.due_date : state.inv.today()),
      7
    );
    $('#eu-sub').textContent = `${u.customer} · current due ${fmtDate(u.due_date)} · remaining ${peso(u.remaining)}`;
    $('#eu-due').value = suggested;
    $('#eu-due').min = state.inv.today();
    $('#eu-days').value = '7';
    $('#eu-note').value = '';
    $('#eu-error').hidden = true;
    $('#extend-utang-dialog').showModal();
    $('#eu-due').focus();
  }

  function submitExtendUtang(e) {
    e.preventDefault();
    const err = msg => { const el = $('#eu-error'); el.textContent = msg; el.hidden = false; };
    const daysRaw = $('#eu-days').value.trim();
    const opts = { note: $('#eu-note').value };
    if (daysRaw !== '') {
      const d = parseInt(daysRaw, 10);
      if (!Number.isInteger(d) || d < 1) return err('Days must be a whole number of at least 1.');
      opts.add_days = d;
    } else {
      opts.new_due = $('#eu-due').value;
    }
    const r = state.inv.extendUtang(state.extendUtangId, opts);
    if (!r.ok) return err(r.error);
    $('#extend-utang-dialog').close();
    persist();
    render();
    notify(`Utang #${r.utang.id} due extended to ${fmtDate(r.new_due)}.`, 'success');
  }

  // ---------------------------------------------------------------- render: finance
  function chartColors() {
    return {
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#2563eb',
      ok: getComputedStyle(document.documentElement).getPropertyValue('--ok').trim() || '#166534',
      bad: getComputedStyle(document.documentElement).getPropertyValue('--bad').trim() || '#b91c1c',
      warn: getComputedStyle(document.documentElement).getPropertyValue('--warn').trim() || '#92400e',
      muted: getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#5a6b86',
      line: getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || '#d8e1ef'
    };
  }

  function barChartSVG(items) {
    const max = Math.max(...items.map(i => Math.abs(i.value)), 1);
    const w = 360, h = 160, pad = 28, gap = 12;
    const barW = (w - pad * 2 - gap * (items.length - 1)) / items.length;
    const zeroY = h - pad;
    const bars = items.map((it, i) => {
      const x = pad + i * (barW + gap);
      const bh = Math.max(4, (Math.abs(it.value) / max) * (h - pad * 2 - 10));
      const y = it.value >= 0 ? zeroY - bh : zeroY;
      const delay = (i * 0.08).toFixed(2);
      return `
        <g class="chart-bar" style="--bar-delay:${delay}s">
          <rect class="bar-rect" x="${x}" y="${y}" width="${barW}" height="${bh}" rx="6" fill="${it.color}" opacity="0.92"
            data-h="${bh}" data-y="${y}" data-zero="${zeroY}"/>
          <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="chart-label">${esc(it.label)}</text>
          <text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" class="chart-val">${peso(it.value)}</text>
        </g>`;
    }).join('');
    return `<svg class="fin-chart chart-animated chart-bars" viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart">${bars}</svg>`;
  }

  /**
   * Single-metric trend line over months (from saved reports + current).
   * series: [{ label: '2026-01', value: number }, ...]
   */
  function trendLineSVG(series, color, title) {
    const ptsIn = series.length ? series : [{ label: '—', value: 0 }];
    const max = Math.max(...ptsIn.map(i => Math.abs(i.value)), 1);
    const w = 340, h = 120, padX = 28, padY = 22;
    const plotW = w - padX * 2;
    const plotH = h - padY * 2 - 8;
    const zeroY = padY + plotH;
    const pts = ptsIn.map((it, i) => {
      const x = padX + (ptsIn.length === 1 ? plotW / 2 : (i / (ptsIn.length - 1)) * plotW);
      const y = zeroY - (Math.abs(it.value) / max) * plotH;
      return { x, y, it };
    });
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const last = pts[pts.length - 1];
    const area = `${path} L${last.x},${zeroY} L${pts[0].x},${zeroY} Z`;
    const pathLen = Math.max(200, pts.length * 80);
    return `
      <div class="trend-card">
        <div class="trend-head">
          <span class="trend-title">${esc(title)}</span>
          <strong class="trend-latest">${peso(last.it.value)}</strong>
        </div>
        <svg class="fin-chart chart-animated chart-line" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)} trend">
          <path class="line-area" d="${area}" fill="${color}" opacity="0.12"/>
          <path class="line-path" d="${path}" fill="none" stroke="${color}" stroke-width="2.5"
            stroke-linejoin="round" stroke-linecap="round"
            style="--path-len:${pathLen}"/>
          ${pts.map(p => `<circle class="line-dot" cx="${p.x}" cy="${p.y}" r="4" fill="${color}"/>`).join('')}
          ${pts.length <= 6 ? pts.map(p => `<text x="${p.x}" y="${h - 4}" text-anchor="middle" class="chart-label">${esc(String(p.it.label).slice(5) || p.it.label)}</text>`).join('') : ''}
        </svg>
      </div>`;
  }

  function buildTrendSeries(key, currentValue, currentLabel) {
    const reports = state.inv.listFinanceReports().slice().reverse(); // oldest → newest
    const series = reports.map(r => ({ label: r.month, value: Number(r[key]) || 0 }));
    const month = state.inv.currentMonthKey();
    if (!series.length || series[series.length - 1].label !== month) {
      series.push({ label: currentLabel || month, value: currentValue });
    } else {
      series[series.length - 1].value = currentValue;
    }
    return series;
  }

  function renderChartBlocks(f) {
    const c = chartColors();
    const type = state.chartType === 'line' ? 'line' : 'bar';
    $$('.chart-type-btn').forEach(b => b.classList.toggle('active', b.dataset.chartType === type));

    if (type === 'bar') {
      const netItems = [
        { label: 'Assets', value: f.assets, color: c.brand },
        { label: 'Net cash', value: f.netCash, color: f.netCash >= 0 ? c.ok : c.bad },
        { label: 'Losses', value: f.expiredLoss, color: c.bad },
        { label: 'Net gain', value: f.netGain, color: f.netGain >= 0 ? c.ok : c.warn }
      ];
      const flowItems = [
        { label: 'Cash sales', value: f.cashSales, color: c.ok },
        { label: 'Refunds', value: f.cashRefunds, color: c.bad },
        { label: 'Utang out', value: f.utangCreated, color: c.warn },
        { label: 'Collected', value: f.utangCollected, color: c.brand }
      ];
      return `
        <div class="chart-block">
          <h3 class="chart-title">Net position</h3>
          ${barChartSVG(netItems)}
        </div>
        <div class="chart-block">
          <h3 class="chart-title">Cash & credit flow</h3>
          ${barChartSVG(flowItems)}
        </div>`;
    }

    // Line mode: one trend chart per metric (history from saved monthly reports)
    const month = state.inv.currentMonthKey();
    return `
      <div class="chart-block chart-block-wide">
        <h3 class="chart-title">Trends over time (saved months + current)</h3>
        <p class="muted chart-hint">Each line tracks one metric. Save monthly reports to build history.</p>
        <div class="trend-grid">
          ${trendLineSVG(buildTrendSeries('assets', f.assets, month), c.brand, 'Assets')}
          ${trendLineSVG(buildTrendSeries('netCash', f.netCash, month), f.netCash >= 0 ? c.ok : c.bad, 'Net cash')}
          ${trendLineSVG(buildTrendSeries('expiredLoss', f.expiredLoss, month), c.bad, 'Net loss (expired)')}
          ${trendLineSVG(buildTrendSeries('netGain', f.netGain, month), f.netGain >= 0 ? c.ok : c.warn, 'Net gain')}
          ${trendLineSVG(buildTrendSeries('cashSales', f.cashSales, month), c.ok, 'Cash sales')}
          ${trendLineSVG(buildTrendSeries('utangCollected', f.utangCollected, month), c.brand, 'Utang collected')}
        </div>
      </div>`;
  }

  function renderFinance() {
    const f = state.inv.financeSummary();
    $('#finance-cards').innerHTML = [
      { label: 'Assets (stock + utang)', value: peso(f.assets), tone: 'green', note: 'Inventory + outstanding credit' },
      { label: 'Net cash movement', value: peso(f.netCash), tone: f.netCash >= 0 ? 'green' : 'red', note: 'Cash sales − refunds + collections' },
      { label: 'Expired losses', value: peso(f.expiredLoss), tone: 'red', note: 'At selling price, pulled out' },
      { label: 'Net gain (illustrative)', value: peso(f.netGain), tone: f.netGain >= 0 ? 'green' : 'red', note: 'Cash movement − expired losses' }
    ].map(c => `
      <article class="card ${c.tone ? 'tone-' + c.tone : ''}">
        <div class="card-top"><span>${c.label}</span></div>
        <div class="card-value">${c.value}</div>
        <div class="card-note">${c.note}</div>
      </article>`).join('');

    const chartEl = $('#finance-charts');
    if (chartEl) chartEl.innerHTML = renderChartBlocks(f);

    const reports = state.inv.listFinanceReports();
    const month = state.inv.currentMonthKey();
    const savedThis = reports.find(r => r.month === month);

    $('#finance-detail').innerHTML = `
      <dl class="fin-grid">
        <div><dt>Sellable inventory value</dt><dd>${peso(f.inventoryValue)}</dd></div>
        <div><dt>Outstanding utang (assets)</dt><dd>${peso(f.outstandingUtang)}</dd></div>
        <div><dt>Cash sales (all time)</dt><dd>${peso(f.cashSales)}</dd></div>
        <div><dt>Cash refunds</dt><dd>${peso(f.cashRefunds)}</dd></div>
        <div><dt>Utang extended</dt><dd>${peso(f.utangCreated)}</dd></div>
        <div><dt>Utang collected</dt><dd>${peso(f.utangCollected)}</dd></div>
        <div><dt>Open utang records</dt><dd>${f.openUtangs}</dd></div>
        <div><dt>Overdue utang records</dt><dd>${f.overdueUtangs}</dd></div>
      </dl>
      <p class="muted fin-note">Values use selling price (cost price is not stored). Net gain is a simplified view for store owners, not formal accounting.</p>
      <div class="report-meta muted">
        Saved monthly reports: <strong>${reports.length}</strong>
        ${savedThis ? ` · This month (${month}) last saved ${esc(fmtTime(savedThis.saved_at))}` : ` · No snapshot yet for ${month}`}
      </div>`;

    const wrap = $('#calculator-wrap');
    const btn = $('#btn-calc-toggle');
    if (wrap && btn) {
      wrap.hidden = !state.calcOpen;
      btn.setAttribute('aria-expanded', state.calcOpen ? 'true' : 'false');
      const hint = $('#calc-bar-hint');
      if (hint) hint.textContent = state.calcOpen ? 'Hide' : 'Show';
    }
  }

  function openCompareDialog() {
    const reports = state.inv.listFinanceReports();
    if (reports.length < 2) {
      notify('Save at least two monthly reports before comparing.', 'error');
      return;
    }
    const opts = reports.map(r => `<option value="${esc(r.month)}">${esc(r.month)} · net gain ${peso(r.netGain)}</option>`).join('');
    $('#cmp-a').innerHTML = opts;
    $('#cmp-b').innerHTML = opts;
    if (reports[1]) $('#cmp-b').value = reports[1].month;
    if (reports[0]) $('#cmp-a').value = reports[0].month;
    renderCompareResult();
    $('#compare-dialog').showModal();
  }

  function renderCompareResult() {
    const a = state.inv.getFinanceReport($('#cmp-a').value);
    const b = state.inv.getFinanceReport($('#cmp-b').value);
    const box = $('#compare-result');
    if (!a || !b) {
      box.innerHTML = '<p class="muted">Select two reports.</p>';
      return;
    }
    const keys = [
      ['assets', 'Assets'],
      ['netCash', 'Net cash'],
      ['expiredLoss', 'Expired losses'],
      ['netGain', 'Net gain'],
      ['inventoryValue', 'Inventory value'],
      ['outstandingUtang', 'Outstanding utang'],
      ['cashSales', 'Cash sales'],
      ['utangCollected', 'Utang collected']
    ];
    box.innerHTML = `
      <div class="compare-grid">
        <div class="compare-col">
          <h3>${esc(a.month)}</h3>
          <p class="sub muted">Saved ${esc(fmtTime(a.saved_at))}</p>
        </div>
        <div class="compare-col center muted">Δ</div>
        <div class="compare-col">
          <h3>${esc(b.month)}</h3>
          <p class="sub muted">Saved ${esc(fmtTime(b.saved_at))}</p>
        </div>
        ${keys.map(([k, label]) => {
          const av = Number(a[k]) || 0;
          const bv = Number(b[k]) || 0;
          const diff = round2(bv - av);
          const cls = diff > 0 ? 'ok' : diff < 0 ? 'bad' : 'muted';
          return `
            <div class="compare-row-label">${esc(label)}</div>
            <div class="num">${peso(av)}</div>
            <div class="num ${cls}">${diff > 0 ? '+' : ''}${peso(diff)}</div>
            <div class="num">${peso(bv)}</div>`;
        }).join('')}
      </div>`;
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  /** Darken a hex color by amount 0–1. */
  function shadeHex(hex, amount) {
    const rgb = parseHex(hex);
    if (!rgb) return hex;
    const r = Math.max(0, Math.min(255, Math.round(rgb.r * (1 - amount))));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g * (1 - amount))));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b * (1 - amount))));
    return rgbToHex(r, g, b);
  }

  /** Lighten toward white by amount 0–1. */
  function tintHex(hex, amount) {
    const rgb = parseHex(hex);
    if (!rgb) return hex;
    const r = Math.max(0, Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount)));
    return rgbToHex(r, g, b);
  }

  function parseHex(hex) {
    let h = String(hex || '').trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, hex: '#' + h.toLowerCase() };
  }

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  function normalizeHexInput(raw) {
    const parsed = parseHex(raw);
    return parsed ? parsed.hex : null;
  }

  /** Build a full palette object from any brand hex. */
  function derivePaletteFromHex(hex) {
    const brand = normalizeHexInput(hex) || '#2563eb';
    return {
      brand,
      soft: tintHex(brand, 0.88),
      strong: shadeHex(brand, 0.18),
      darkBrand: tintHex(brand, 0.35),
      darkSoft: shadeHex(brand, 0.78),
      darkStrong: tintHex(brand, 0.55)
    };
  }

  function syncCustomColorUI(hex) {
    const h = normalizeHexInput(hex) || '#2563eb';
    const picker = $('#custom-color-picker');
    const input = $('#custom-hex-input');
    const ring = $('#custom-swatch-ring');
    if (picker) picker.value = h;
    if (input) input.value = h;
    if (ring) ring.style.setProperty('--sw', h);
  }

  function applyPaletteTokens(p) {
    const root = document.documentElement;
    const dark = root.getAttribute('data-theme') === 'dark';
    const brand = dark ? p.darkBrand : p.brand;
    const soft = dark ? p.darkSoft : p.soft;
    const strong = dark ? p.darkStrong : p.strong;
    root.style.setProperty('--brand', brand);
    root.style.setProperty('--brand-soft', soft);
    root.style.setProperty('--brand-strong', strong);
    root.style.setProperty('--nav-accent', brand);

    if (dark) {
      const baseBrand = p.brand;
      root.style.setProperty('--bg', shadeHex(baseBrand, 0.88));
      root.style.setProperty('--surface', shadeHex(baseBrand, 0.82));
      root.style.setProperty('--surface-2', shadeHex(baseBrand, 0.86));
      root.style.setProperty('--line', 'color-mix(in srgb, ' + brand + ' 22%, #1a2438)');
      root.style.setProperty('--ink', '#eef2ff');
      root.style.setProperty('--muted', 'color-mix(in srgb, ' + brand + ' 35%, #8b9bb8)');
      root.style.setProperty('--nav', shadeHex(baseBrand, 0.72));
      root.style.setProperty('--nav-ink', '#f5f3ff');
      root.style.setProperty('--nav-muted', 'color-mix(in srgb, ' + brand + ' 50%, #9aa8c0)');
      root.style.setProperty('--nav-hover', 'color-mix(in srgb, ' + brand + ' 24%, transparent)');
      root.style.setProperty('--shadow', '0 10px 30px color-mix(in srgb, ' + baseBrand + ' 35%, rgba(0,0,0,0.45))');
      root.setAttribute('data-palette-mode', 'dark-tinted');
    } else {
      root.style.setProperty('--bg', colorMixNeutralBg(p.brand));
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-2', '#f6f8fc');
      root.style.setProperty('--line', 'color-mix(in srgb, ' + p.brand + ' 14%, #d8e1ef)');
      root.style.setProperty('--ink', '#0f1c33');
      root.style.setProperty('--muted', '#5a6b86');
      root.style.setProperty('--nav', shadeHex(p.brand, 0.62));
      root.style.setProperty('--nav-ink', '#f5f8ff');
      root.style.setProperty('--nav-muted', 'color-mix(in srgb, #ffffff 55%, ' + brand + ')');
      root.style.setProperty('--nav-hover', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--shadow', '0 10px 30px rgba(15, 28, 51, 0.08)');
      root.setAttribute('data-palette-mode', 'light-outline');
    }
  }

  function colorMixNeutralBg(brand) {
    // Very subtle wash of accent in page background for cohesion
    return 'color-mix(in srgb, ' + brand + ' 4%, #f0f4fa)';
  }

  function applyPalette(name) {
    if (name === 'custom') {
      const hex = normalizeHexInput(state.customHex || safeGet(CUSTOM_HEX_KEY) || '#2563eb');
      state.palette = 'custom';
      state.customHex = hex;
      applyPaletteTokens(derivePaletteFromHex(hex));
      safeSet(PALETTE_KEY, 'custom');
      safeSet(CUSTOM_HEX_KEY, hex);
      syncCustomColorUI(hex);
      $$('.palette-swatch').forEach(s => s.classList.remove('active'));
      const ring = $('#custom-swatch-ring');
      if (ring) ring.classList.add('active');
      return;
    }
    const key = PALETTES[name] ? name : 'blue';
    state.palette = key;
    applyPaletteTokens(PALETTES[key]);
    safeSet(PALETTE_KEY, key);
    $$('.palette-swatch').forEach(s => s.classList.toggle('active', s.dataset.palette === key));
    const ring = $('#custom-swatch-ring');
    if (ring) ring.classList.remove('active');
    // Keep hex field in sync with preset for easy tweaking
    if (PALETTES[key]) syncCustomColorUI(PALETTES[key].brand);
  }

  function applyCustomHex(raw, { silent } = {}) {
    const hex = normalizeHexInput(raw);
    if (!hex) {
      if (!silent) notify('Enter a valid hex color like #7c3aed.', 'error');
      return false;
    }
    state.customHex = hex;
    applyPalette('custom');
    if (state.view === 'finance') renderFinance();
    if (!silent) notify('Custom accent applied.', 'success');
    return true;
  }

  function openAppearance() {
    const mode = document.documentElement.getAttribute('data-theme') || 'light';
    $$('.theme-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    $$('.palette-swatch').forEach(s => s.classList.toggle('active', s.dataset.palette === state.palette));
    const ring = $('#custom-swatch-ring');
    if (ring) ring.classList.toggle('active', state.palette === 'custom');
    const hex = state.palette === 'custom'
      ? (state.customHex || safeGet(CUSTOM_HEX_KEY) || '#2563eb')
      : (PALETTES[state.palette] ? PALETTES[state.palette].brand : '#2563eb');
    syncCustomColorUI(hex);
    $('#appearance-dialog').showModal();
  }

  /** Keep only digits and calculator operators; strip letters and other junk. */
  function sanitizeCalc(text) {
    return String(text || '')
      .replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-')
      .replace(/[^0-9+\-*/().%\s]/g, '');
  }

  function calcAppend(k) {
    const disp = $('#calc-display');
    if (k === 'C') { disp.value = ''; $('#calc-result').textContent = ''; return; }
    if (k === '=') {
      const cleaned = sanitizeCalc(disp.value);
      disp.value = cleaned;
      const r = Calculator.evaluate(cleaned);
      if (r.ok) {
        $('#calc-result').textContent = `= ${r.value}`;
        disp.value = String(r.value);
      } else {
        $('#calc-result').textContent = r.error;
      }
      return;
    }
    // Only allow keypad symbols (already safe); still sanitize after paste-like ops
    disp.value = sanitizeCalc(disp.value + k);
  }

  // ---------------------------------------------------------------- dialogs: product / batch
  function refreshAutoSku() {
    if (state.editSku) return;
    const cat = $('#pd-category').value.trim();
    if (!cat) {
      $('#pd-sku').value = '';
      $('#pd-sku').placeholder = 'Set category first';
      return;
    }
    $('#pd-sku').value = state.inv.nextSkuForCategory(cat);
  }

  function openProduct(sku) {
    state.editSku = sku || null;
    const inv = state.inv;
    const p = sku ? inv.getProduct(sku) : null;
    $('#product-form').reset();
    $('#pd-error').hidden = true;
    $('#pd-title').textContent = p ? 'Edit product' : 'Add product';
    $('#pd-sub').textContent = p
      ? 'SKU stays fixed. To change stock, use the batches button on the product row.'
      : 'SKU is generated from the category (e.g. Alcohol → ALC-001).';
    $('#pd-save').textContent = p ? 'Save changes' : 'Save product';
    $('#pd-sku').readOnly = true;
    ['#pd-stock-title', '#pd-qty-wrap', '#pd-exp-wrap'].forEach(s => { $(s).hidden = !!p; });
    if (p) {
      $('#pd-name').value = p.name; $('#pd-sku').value = p.sku; $('#pd-category').value = p.category;
      $('#pd-price').value = p.price; $('#pd-reorder').value = p.reorder_level;
    } else {
      $('#pd-reorder').placeholder = String(inv.defaultReorder);
      $('#pd-sku').value = '';
      $('#pd-sku').placeholder = 'Set category first';
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
      if (!data.category.trim()) return err('Category is required to generate a SKU.');
      refreshAutoSku();
      const sku = $('#pd-sku').value.trim();
      if (!sku) return err('Could not generate a SKU. Check the category.');
      const qtyRaw = $('#pd-qty').value, exp = $('#pd-expiry').value;
      if (qtyRaw !== '') {
        const c = inv.checkBatch(qtyRaw, exp);
        if (!c.ok) return err(c.error);
      }
      const r = inv.addProduct({ ...data, sku });
      if (!r.ok) return err(r.error);
      if (qtyRaw !== '') inv.addBatch(r.product.sku, qtyRaw, exp);
      notify(`${r.product.name} added as ${r.product.sku}.`, 'success');
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

  function openBatches(sku) {
    state.batchSku = sku;
    $('#batch-form').reset();
    $('#bd-error').hidden = true;
    renderBatchDialog();
    $('#batch-dialog').showModal();
    $('#bd-qty').focus();
  }

  function renderBatchDialog() {
    const p = state.inv.getProduct(state.batchSku);
    if (!p) return;
    $('#bd-title').textContent = p.name;
    $('#bd-sub').textContent = `SKU ${p.sku}`;
    const batches = state.inv.batchesOf(p.sku);
    const today = state.inv.today();
    $('#bd-body').innerHTML = batches.map(b => {
      const exp = b.expiry_date ? fmtDate(b.expiry_date) : 'No expiry';
      const status = state.inv.isExpired(b)
        ? '<span class="badge bad">Expired</span>'
        : (b.expiry_date ? dayBadge(Dates.daysBetween(today, b.expiry_date)) : '<span class="badge neutral">—</span>');
      return `<tr>
        <td class="mono">#${b.id}</td>
        <td class="num">${b.qty}</td>
        <td>${esc(exp)}</td>
        <td>${esc(fmtDate(b.received_date))}</td>
        <td>${status}</td>
        <td><button type="button" class="icon-btn danger" data-rm-batch="${b.id}" aria-label="Remove batch">${icon('trash')}</button></td>
      </tr>`;
    }).join('');
    $('#bd-empty').hidden = batches.length !== 0;
  }

  function submitBatch(e) {
    e.preventDefault();
    const err = msg => { const el = $('#bd-error'); el.textContent = msg; el.hidden = false; };
    const r = state.inv.addBatch(state.batchSku, $('#bd-qty').value, $('#bd-expiry').value);
    if (!r.ok) return err(r.error);
    $('#batch-form').reset();
    persist();
    renderBatchDialog();
    render();
    notify('Stock received.', 'success');
  }

  async function removeBatch(batchId) {
    const ok = await askConfirm('Remove this batch from stock?', 'Remove');
    if (!ok) return;
    state.inv.removeBatch(state.batchSku, Number(batchId));
    persist();
    renderBatchDialog();
    render();
  }

  // ---------------------------------------------------------------- data tools
  function exportJSON() {
    const blob = new Blob([JSON.stringify(state.inv.toJSON(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inventory-${Dates.todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify('Exported current data.', 'success');
  }

  async function importFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const obj = JSON.parse(text);
      const r = state.inv.importAny(obj);
      if (r.errors && r.errors.length) notify(`Loaded with ${r.errors.length} issue(s).`, 'error');
      else notify('Data imported.', 'success');
      persist();
      render();
    } catch (e) {
      notify('Could not read that file: ' + e.message, 'error');
    }
  }

  async function resetSample() {
    const ok = await askConfirm('Replace all data with the sample catalog? Unsaved changes will be lost.', 'Reset');
    if (!ok) return;
    await loadSample();
    persist();
    render();
    notify('Sample data loaded.', 'success');
  }

  async function loadSample() {
    const seed = await fetchJSON('data/products.json') || FALLBACK_SEED;
    state.inv.importSeed(seed);
    if (!(await fetchJSON('data/products.json'))) {
      showNotice('Could not load data/products.json (file:// or offline). Using a small built-in sample. Use Import JSON to load the full file.');
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    safeSet(THEME_KEY, theme);
    applyPalette(state.palette || safeGet(PALETTE_KEY) || 'blue');
    $$('.theme-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === theme));
  }

  function updateClock() {
    const el = $('#today-label');
    if (!el) return;
    const now = new Date();
    const datePart = now.toLocaleDateString(state.config.locale, {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
    const timePart = now.toLocaleTimeString(state.config.locale, {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    el.textContent = `${datePart} · ${timePart}`;
  }

  /**
   * Scroll brand text only when it truly overflows.
   * Uses a small slack so near-fitting names stay still.
   */
  function updateBrandMarquees() {
    $$('.brand-marquee').forEach(track => {
      const text = track.querySelector('.brand-scroll');
      if (!text) return;
      track.classList.remove('is-overflow');
      text.style.removeProperty('--scroll-dist');
      track.style.removeProperty('--scroll-dist');
      // Force layout without animation/padding artifacts
      void text.offsetWidth;
      const slack = 6; // px tolerance — almost-fitting text does not scroll
      const overflow = text.scrollWidth - track.clientWidth;
      if (overflow > slack) {
        // Only travel the true overflow, not extra padding
        const dist = Math.ceil(overflow);
        track.style.setProperty('--scroll-dist', dist + 'px');
        text.style.setProperty('--scroll-dist', dist + 'px');
        track.classList.add('is-overflow');
      }
    });
  }

  function loadStoreMeta() {
    try {
      const raw = safeGet(STORE_META_KEY);
      if (!raw) return;
      const meta = JSON.parse(raw);
      if (meta && typeof meta === 'object') {
        if (meta.store_name) state.config.store_name = String(meta.store_name).slice(0, 48);
        if (meta.store_tagline) state.config.store_tagline = String(meta.store_tagline).slice(0, 64);
      }
    } catch (_) { /* ignore */ }
  }

  function saveStoreMeta() {
    safeSet(STORE_META_KEY, JSON.stringify({
      store_name: state.config.store_name,
      store_tagline: state.config.store_tagline || ''
    }));
  }

  function applyBrandToUI() {
    const nameEl = $('#brand-name');
    const subEl = $('#brand-sub');
    if (nameEl && document.activeElement !== nameEl) nameEl.textContent = state.config.store_name || 'Store';
    if (subEl && document.activeElement !== subEl) subEl.textContent = state.config.store_tagline || '';
    document.title = `${state.config.store_name}: inventory`;
    requestAnimationFrame(updateBrandMarquees);
  }

  function commitBrandEdit(el) {
    if (!el) return;
    const isName = el.id === 'brand-name';
    let val = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (isName) {
      if (!val) val = state.config.store_name || DEFAULT_CONFIG.store_name;
      state.config.store_name = val.slice(0, 48);
    } else {
      state.config.store_tagline = val.slice(0, 64);
    }
    el.textContent = isName ? state.config.store_name : state.config.store_tagline;
    saveStoreMeta();
    document.title = `${state.config.store_name}: inventory`;
    requestAnimationFrame(updateBrandMarquees);
  }

  function bindBrandEditors() {
    ['brand-name', 'brand-sub'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          el.blur();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          applyBrandToUI();
          el.blur();
        }
      });
      el.addEventListener('blur', () => commitBrandEdit(el));
      el.addEventListener('focus', () => {
        // stop marquee while editing
        el.closest('.brand-marquee')?.classList.remove('is-overflow');
      });
    });
  }

  // ---------------------------------------------------------------- events
  function bindEvents() {
    // nav
    $$('.nav-item[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    const appearanceBtn = $('#btn-appearance');
    if (appearanceBtn) appearanceBtn.addEventListener('click', openAppearance);
    $('#btn-menu').addEventListener('click', () => {
      $('#sidebar').classList.add('open');
      $('#scrim').classList.add('show');
    });
    $('#scrim').addEventListener('click', closeSidebar);
    $('#btn-collapse').addEventListener('click', () => applyCollapse(!state.collapsed));
    $$('.theme-mode-btn').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.mode)));
    $$('.palette-swatch').forEach(b => b.addEventListener('click', () => {
      applyPalette(b.dataset.palette);
      if (state.view === 'finance') renderFinance();
    }));
    const colorPicker = $('#custom-color-picker');
    const hexInput = $('#custom-hex-input');
    const applyCustomBtn = $('#btn-apply-custom-color');
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        syncCustomColorUI(colorPicker.value);
        applyCustomHex(colorPicker.value, { silent: true });
      });
      colorPicker.addEventListener('change', () => applyCustomHex(colorPicker.value));
    }
    if (hexInput) {
      hexInput.addEventListener('input', () => {
        const v = hexInput.value.trim();
        if (normalizeHexInput(v)) {
          const ring = $('#custom-swatch-ring');
          if (ring) ring.style.setProperty('--sw', normalizeHexInput(v));
          if (colorPicker) colorPicker.value = normalizeHexInput(v);
        }
      });
      hexInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCustomHex(hexInput.value);
        }
      });
    }
    if (applyCustomBtn) applyCustomBtn.addEventListener('click', () => applyCustomHex(hexInput ? hexInput.value : ''));
    $$('.chart-type-btn').forEach(b => b.addEventListener('click', () => {
      state.chartType = b.dataset.chartType === 'line' ? 'line' : 'bar';
      safeSet(CHART_TYPE_KEY, state.chartType);
      if (state.view === 'finance') renderFinance();
    }));
    const saveRep = $('#btn-save-report');
    if (saveRep) saveRep.addEventListener('click', () => {
      const r = state.inv.saveFinanceReport();
      persist();
      renderFinance();
      notify(`Saved finance report for ${r.report.month}.`, 'success');
    });
    const cmpBtn = $('#btn-compare-reports');
    if (cmpBtn) cmpBtn.addEventListener('click', openCompareDialog);
    const cmpA = $('#cmp-a');
    const cmpB = $('#cmp-b');
    if (cmpA) cmpA.addEventListener('change', renderCompareResult);
    if (cmpB) cmpB.addEventListener('change', renderCompareResult);
    $('#btn-notif-quick').addEventListener('click', e => {
      e.stopPropagation();
      setNotifOpen(!state.notifOpen);
    });
    $('#btn-notif-close').addEventListener('click', () => setNotifOpen(false));
    document.addEventListener('click', e => {
      if (!state.notifOpen) return;
      const wrap = $('#notif-wrap');
      if (wrap && !wrap.contains(e.target)) setNotifOpen(false);
    });
    $('#notif-panel-body').addEventListener('click', e => {
      const dismiss = e.target.closest('[data-dismiss-notif]');
      if (dismiss) {
        e.stopPropagation();
        dismissNotif(dismiss.dataset.dismissNotif);
        return;
      }
      const item = e.target.closest('.notif-item');
      if (!item) return;
      goToNotif({
        type: item.dataset.notifType,
        sku: item.dataset.sku || undefined,
        id: item.dataset.utangId ? Number(item.dataset.utangId) : undefined
      });
    });
    $('#notice-close').addEventListener('click', () => { $('#notice').hidden = true; });

    // inventory filters
    $('#f-search').addEventListener('input', e => { state.filters.q = e.target.value; renderTable(); });
    $('#f-category').addEventListener('change', e => { state.filters.category = e.target.value; renderTable(); });
    $('#f-status').addEventListener('change', e => { state.filters.status = e.target.value; renderTable(); });
    $('#btn-add-product').addEventListener('click', () => openProduct());
    $('#btn-print-reorder').addEventListener('click', printReorderList);
    $('#pd-category').addEventListener('input', refreshAutoSku);
    $('#pd-category').addEventListener('change', refreshAutoSku);

    const calcToggle = $('#btn-calc-toggle');
    if (calcToggle) {
      calcToggle.addEventListener('click', () => {
        state.calcOpen = !state.calcOpen;
        const wrap = $('#calculator-wrap');
        wrap.hidden = !state.calcOpen;
        calcToggle.setAttribute('aria-expanded', state.calcOpen ? 'true' : 'false');
        const hint = $('#calc-bar-hint');
        if (hint) hint.textContent = state.calcOpen ? 'Hide' : 'Show';
      });
    }

    $('#inv-body').addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const sku = btn.dataset.sku;
      if (btn.dataset.action === 'edit') openProduct(sku);
      else if (btn.dataset.action === 'batches') openBatches(sku);
      else if (btn.dataset.action === 'delete') deleteProduct(sku);
    });

    // product / batch dialogs
    $('#product-form').addEventListener('submit', submitProduct);
    $('#batch-form').addEventListener('submit', submitBatch);
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => {
      const dlg = b.closest('dialog');
      if (dlg) dlg.close();
    }));
    $('#bd-body').addEventListener('click', e => {
      const btn = e.target.closest('[data-rm-batch]');
      if (btn) removeBatch(btn.dataset.rmBatch);
    });

    // billing
    $('#b-sku').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const sku = e.target.value.trim();
        if (sku) { addToCart(sku); e.target.value = ''; }
      }
    });
    $('#b-search').addEventListener('input', e => renderResults(e.target.value));
    $('#b-results').addEventListener('click', e => {
      const row = e.target.closest('[data-sku]');
      if (row && !row.disabled) addToCart(row.dataset.sku);
    });
    $('#btn-clear-cart').addEventListener('click', () => { state.cart = []; renderCart(); });
    $('#btn-checkout').addEventListener('click', openCheckout);
    $('#cart-body').addEventListener('click', e => {
      const dec = e.target.closest('[data-cart-dec]');
      const inc = e.target.closest('[data-cart-inc]');
      const rm = e.target.closest('[data-cart-rm]');
      if (dec) {
        const i = Number(dec.dataset.cartDec);
        state.cart[i].qty--;
        if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
        renderCart();
      } else if (inc) {
        const i = Number(inc.dataset.cartInc);
        const line = state.cart[i];
        const info = state.inv.stockInfo(line.sku);
        if (line.qty >= info.sellable) return notify(`Only ${info.sellable} sellable.`, 'error');
        line.qty++;
        renderCart();
      } else if (rm) {
        state.cart.splice(Number(rm.dataset.cartRm), 1);
        renderCart();
      }
    });
    $('#btn-print').addEventListener('click', () => window.print());
    $('#sales-list').addEventListener('click', e => {
      const view = e.target.closest('[data-view-sale]');
      const ref = e.target.closest('[data-refund]');
      if (view) { state.lastSaleId = Number(view.dataset.viewSale); renderSlip(); renderSales(); }
      if (ref) openRefund(ref.dataset.refund);
    });

    // checkout / refund / pay utang
    $$('input[name="pay-mode"]').forEach(r => r.addEventListener('change', () => {
      $('#utang-fields').hidden = r.value !== 'utang' || !r.checked ? ($('input[name="pay-mode"]:checked') || {}).value !== 'utang' : false;
      // re-evaluate
      const mode = ($('input[name="pay-mode"]:checked') || {}).value;
      $('#utang-fields').hidden = mode !== 'utang';
    }));
    // fix radio change
    document.querySelectorAll('input[name="pay-mode"]').forEach(r => {
      r.addEventListener('change', () => {
        $('#utang-fields').hidden = ($('input[name="pay-mode"]:checked') || {}).value !== 'utang';
      });
    });
    $('#checkout-form').addEventListener('submit', submitCheckout);
    $('#refund-form').addEventListener('submit', submitRefund);
    $('#pay-utang-form').addEventListener('submit', submitPayUtang);

    // expiry
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
      const ok = await askConfirm(`Pull out ${n} expired batch(es)? They will be removed from stock and recorded as loss.`, 'Pull out');
      if (!ok) return;
      const r = state.inv.pullOutExpired();
      persist(); render();
      notify(`Pulled out ${r.qty} pcs. Estimated loss ${peso(r.loss)}.`, 'success');
    });

    // utang filters
    $('#u-search').addEventListener('input', e => { state.utangFilters.q = e.target.value; renderUtang(); });
    $('#u-status').addEventListener('change', e => { state.utangFilters.status = e.target.value; renderUtang(); });
    $('#utang-body').addEventListener('click', e => {
      const pay = e.target.closest('[data-pay-utang]');
      const ext = e.target.closest('[data-extend-utang]');
      if (pay) openPayUtang(pay.dataset.payUtang);
      if (ext) openExtendUtang(ext.dataset.extendUtang);
    });
    $('#extend-utang-form').addEventListener('submit', submitExtendUtang);
    $('#eu-days').addEventListener('input', () => {
      const d = parseInt($('#eu-days').value, 10);
      if (!Number.isInteger(d) || d < 1) return;
      const u = state.inv.utangs.find(x => x.id === state.extendUtangId);
      if (!u) return;
      const base = u.due_date && u.due_date > state.inv.today() ? u.due_date : state.inv.today();
      $('#eu-due').value = Dates.addDays(base, d);
    });

    // calculator — block letters; only digits and operators
    const calcRoot = $('#calculator');
    if (calcRoot) {
      calcRoot.addEventListener('click', e => {
        const k = e.target.closest('[data-k]');
        if (k) calcAppend(k.dataset.k);
      });
    }
    const calcDisp = $('#calc-display');
    if (calcDisp) {
      calcDisp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); calcAppend('='); return; }
        if (e.key === 'Escape') { e.preventDefault(); calcAppend('C'); return; }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowed = /^(Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Home|End)$/;
        if (allowed.test(e.key)) return;
        if (!/^[0-9+\-*/().%\s]$/.test(e.key) && e.key.length === 1) e.preventDefault();
      });
      calcDisp.addEventListener('input', () => {
        const cleaned = sanitizeCalc(calcDisp.value);
        if (cleaned !== calcDisp.value) {
          const pos = calcDisp.selectionStart;
          calcDisp.value = cleaned;
          try { calcDisp.setSelectionRange(pos - 1, pos - 1); } catch (_) { /* ignore */ }
        }
      });
      calcDisp.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const start = calcDisp.selectionStart || 0;
        const end = calcDisp.selectionEnd || 0;
        calcDisp.value = sanitizeCalc(calcDisp.value.slice(0, start) + text + calcDisp.value.slice(end));
      });
    }

    // data tools
    $('#btn-export').addEventListener('click', exportJSON);
    $('#btn-import').addEventListener('click', () => $('#file-import').click());
    $('#file-import').addEventListener('change', e => { importFile(e.target.files[0]); e.target.value = ''; });
    $('#btn-reset').addEventListener('click', resetSample);
  }

  // ---------------------------------------------------------------- start-up
  async function init() {
    renderIcons();
    loadDismissed();
    state.customHex = safeGet(CUSTOM_HEX_KEY) || '#2563eb';
    state.palette = safeGet(PALETTE_KEY) || 'blue';
    state.chartType = safeGet(CHART_TYPE_KEY) === 'line' ? 'line' : 'bar';
    const savedTheme = safeGet(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(savedTheme);
    applyCollapse(safeGet(COLLAPSE_KEY) === '1');

    const cfg = await fetchJSON('data/config.json');
    state.config = { ...DEFAULT_CONFIG, ...(cfg || {}), storage_key: 'store-inventory-v3' };
    try { state.fmt = new Intl.NumberFormat(state.config.locale, { style: 'currency', currency: state.config.currency }); }
    catch (e) { state.fmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }); }

    state.inv = new Inventory({ defaultReorder: state.config.default_reorder_level });
    if (!state.config.store_tagline) state.config.store_tagline = DEFAULT_CONFIG.store_tagline;
    loadStoreMeta();
    applyBrandToUI();
    bindBrandEditors();
    window.addEventListener('resize', updateBrandMarquees);
    updateClock();
    setInterval(updateClock, 1000);

    let loaded = false;
    // try v3 then fall back to v2 key for migration
    let saved = safeGet(state.config.storage_key);
    if (!saved) saved = safeGet('store-inventory-v2');
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
