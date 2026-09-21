import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Landmark, E as BellOff, S as Layers, T as Bell, _ as Pencil, a as TriangleAlert, b as Moon, c as Trash2, d as ShoppingCart, f as Settings, g as PiggyBank, h as Plus, i as Undo2, l as Tag, m as Printer, n as Wallet, o as TrendingUp, p as Scale, r as UserPlus, s as TrendingDown, t as X, u as Sun, v as Package, w as Clock, x as Menu, y as PackageMinus } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Tooltip, i as ResponsiveContainer, n as Pie, r as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D40nxd-r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var tones = {
	ok: "bg-ok-bg text-ok",
	warn: "bg-warn-bg text-warn",
	bad: "bg-danger-bg text-danger",
	info: "bg-info-bg text-info",
	neutral: "bg-surface-3 text-muted"
};
function Badge({ tone = "neutral", className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone], className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[background-color,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger text-danger-fg hover:opacity-90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2"
		},
		size: {
			sm: "h-9 px-3 text-sm",
			md: "h-10 px-3.5 text-sm",
			lg: "h-11 px-4 text-sm",
			icon: "size-10",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, title, description, wide, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/55 data-[state=open]:animate-in data-[state=closed]:animate-out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-surface p-5 text-fg shadow-lift", wide && "w-[min(720px,94vw)]", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-lg font-semibold tracking-tight",
				children: title
			}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "mt-1 text-sm text-muted",
				children: description
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "sr-only",
				children: title
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			})]
		}), children]
	})] });
}
function DialogActions({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 flex flex-wrap justify-end gap-2",
		children
	});
}
function Panel({ title, subtitle, actions, children, className, bodyClassName, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("overflow-hidden rounded-xl border border-border bg-surface", tone === "watch" && "border-warn/40", className),
		children: [(title || actions) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3 px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold tracking-tight",
					children: title
				}) : null, subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted",
					children: subtitle
				}) : null]
			}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-none flex-wrap gap-2",
				children: actions
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: bodyClassName,
			children
		})]
	});
}
function StatCard({ label, value, note, icon, tone, emphasis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("relative rounded-[10px] border border-border bg-surface px-5 py-4 pl-5", emphasis && "bg-warn-bg border-warn/35"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-3 bottom-3 left-0 w-1 rounded-r", tone === "amber" && "bg-warn", tone === "red" && "bg-danger", tone === "green" && "bg-ok", tone === "teal" && "bg-accent", !tone && "bg-accent") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-sm font-medium text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums",
				children: value
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-xs text-muted",
				children: note
			}) : null
		]
	});
}
function Empty({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-10 text-center text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "mb-1 block text-fg",
			children: title
		}), body]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full min-w-0 rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-fg-subtle", "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring", "disabled:opacity-50", className),
		...props
	});
}
function Field({ label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("grid gap-1.5 text-sm font-medium text-fg", className),
		children: [label, children]
	});
}
var Dates = {
	pad: (n) => String(n).padStart(2, "0"),
	todayStr(d = /* @__PURE__ */ new Date()) {
		return `${d.getFullYear()}-${Dates.pad(d.getMonth() + 1)}-${Dates.pad(d.getDate())}`;
	},
	isValid(str) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
		const [y, m, d] = str.split("-").map(Number);
		const dt = new Date(y, m - 1, d);
		return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
	},
	parse(str) {
		const [y, m, d] = str.split("-").map(Number);
		return new Date(y, m - 1, d);
	},
	daysBetween(fromStr, toStr) {
		return Math.round((Dates.parse(toStr).getTime() - Dates.parse(fromStr).getTime()) / 864e5);
	},
	addDays(str, n) {
		const d = Dates.parse(str);
		d.setDate(d.getDate() + n);
		return Dates.todayStr(d);
	}
};
var round2 = (n) => Math.round(n * 100) / 100;
var toCents = (n) => Math.round(n * 100);
var fail = (error) => ({
	ok: false,
	error
});
var normSku = (s) => String(s == null ? "" : s).trim().toUpperCase();
var parsePrice = (v) => {
	if (v === "" || v == null) return null;
	const n = Number(v);
	return Number.isFinite(n) && n >= 0 ? round2(n) : null;
};
var parseReorder = (v, fallback) => {
	if (v === "" || v == null) return fallback;
	const n = Number(v);
	return Number.isInteger(n) && n >= 0 ? n : null;
};
var parseQty = (v) => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : null;
};
function peso(n, locale = "en-PH") {
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: "PHP"
		}).format(n);
	} catch {
		return `₱${n.toFixed(2)}`;
	}
}
function fmtDate(str, locale = "en-PH") {
	if (!str) return "";
	return Dates.parse(str).toLocaleDateString(locale, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function fmtTime(iso, locale = "en-PH") {
	return new Date(iso).toLocaleString(locale, {
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function fmtClock(iso, locale = "en-PH") {
	return new Date(iso).toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function dayLabel(daysLeft) {
	if (daysLeft < 0) return `Expired ${-daysLeft}d ago`;
	if (daysLeft === 0) return "Expires today";
	if (daysLeft === 1) return "1 day left";
	return `${daysLeft}d left`;
}
var MinHeap = class MinHeap {
	cmp;
	a;
	constructor(cmp) {
		this.cmp = cmp || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
		this.a = [];
	}
	static from(items, cmp) {
		const h = new MinHeap(cmp);
		h.a = items.slice();
		for (let i = (h.a.length >> 1) - 1; i >= 0; i--) h._down(i);
		return h;
	}
	size() {
		return this.a.length;
	}
	isEmpty() {
		return this.a.length === 0;
	}
	peek() {
		return this.a[0];
	}
	push(item) {
		this.a.push(item);
		this._up(this.a.length - 1);
	}
	pop() {
		const a = this.a;
		if (a.length === 0) return void 0;
		const top = a[0];
		const last = a.pop();
		if (a.length > 0) {
			a[0] = last;
			this._down(0);
		}
		return top;
	}
	forEach(fn) {
		this.a.forEach(fn);
	}
	toArray() {
		return this.a.slice();
	}
	removeWhere(pred) {
		const kept = this.a.filter((x) => !pred(x));
		const removed = this.a.length - kept.length;
		if (removed > 0) {
			this.a = kept;
			for (let i = (kept.length >> 1) - 1; i >= 0; i--) this._down(i);
		}
		return removed;
	}
	_up(i) {
		const a = this.a;
		while (i > 0) {
			const p = i - 1 >> 1;
			if (this.cmp(a[i], a[p]) >= 0) break;
			[a[i], a[p]] = [a[p], a[i]];
			i = p;
		}
	}
	_down(i) {
		const a = this.a;
		const n = a.length;
		while (true) {
			const l = 2 * i + 1;
			const r = l + 1;
			let m = i;
			if (l < n && this.cmp(a[l], a[m]) < 0) m = l;
			if (r < n && this.cmp(a[r], a[m]) < 0) m = r;
			if (m === i) break;
			[a[i], a[m]] = [a[m], a[i]];
			i = m;
		}
	}
};
var DEFAULT_SETTINGS = {
	storeName: "Sample Mini-Grocery",
	currency: "PHP",
	locale: "en-PH",
	expiryWarningDays: 14,
	defaultReorder: 5,
	defaultDebtDays: 7,
	notificationsEnabled: true,
	notifyExpiry: true,
	notifyLowStock: true,
	notifyDebts: true,
	dismissedIds: [],
	theme: "light",
	slipFooter: "Thank you! This is a sales slip, not an official BIR receipt."
};
var STORAGE_KEY = "store-inventory-v3";
var expiryKey = (b) => b.expiry_date || "9999-12-31";
function batchCmp(x, y) {
	const kx = expiryKey(x);
	const ky = expiryKey(y);
	if (kx < ky) return -1;
	if (kx > ky) return 1;
	return x.id - y.id;
}
function refreshDebtStatus(d, today) {
	if (d.status === "cancelled") return "cancelled";
	if (d.remaining <= 0) return "paid";
	if (d.dueDate <= today) return "overdue";
	return "open";
}
var Inventory = class {
	clock;
	defaultReorder;
	products = /* @__PURE__ */ new Map();
	heaps = /* @__PURE__ */ new Map();
	sales = [];
	activity = [];
	settings = { ...DEFAULT_SETTINGS };
	customers = [];
	debts = [];
	pullouts = [];
	cashEvents = [];
	nextBatchId = 1;
	nextSaleId = 1;
	nextCustomerId = 1;
	nextDebtId = 1;
	nextPaymentId = 1;
	nextPulloutId = 1;
	nextCashId = 1;
	constructor(opts = {}) {
		this.clock = opts.clock || (() => Dates.todayStr());
		this.defaultReorder = opts.defaultReorder ?? 5;
	}
	today() {
		return this.clock();
	}
	isExpired(batch) {
		return !!batch.expiry_date && batch.expiry_date < this.today();
	}
	log(message) {
		this.activity.unshift({
			message,
			time: (/* @__PURE__ */ new Date()).toISOString()
		});
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
	getProduct(sku) {
		return this.products.get(normSku(sku));
	}
	addProduct(p) {
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
		const product = {
			sku,
			name,
			category,
			price,
			cost: costRaw,
			reorder_level: reorder
		};
		this.products.set(sku, product);
		this.heaps.set(sku, new MinHeap(batchCmp));
		this.log(`Added product ${name}.`);
		return {
			ok: true,
			product
		};
	}
	updateProduct(sku, f) {
		const p = this.getProduct(sku);
		if (!p) return fail("Product not found.");
		const next = {};
		if (f.name !== void 0) {
			next.name = String(f.name).trim();
			if (!next.name) return fail("Product name is required.");
		}
		if (f.category !== void 0) next.category = String(f.category).trim() || "Uncategorized";
		if (f.price !== void 0) {
			const price = parsePrice(f.price);
			if (price === null) return fail("Price must be a number, 0 or higher.");
			next.price = price;
		}
		if (f.cost !== void 0) {
			const cost = f.cost === "" || f.cost == null ? 0 : parsePrice(f.cost);
			if (cost === null) return fail("Cost must be a number, 0 or higher.");
			next.cost = cost;
		}
		if (f.reorder_level !== void 0) {
			const reorder = parseReorder(f.reorder_level, this.defaultReorder);
			if (reorder === null) return fail("Reorder level must be a whole number, 0 or higher.");
			next.reorder_level = reorder;
		}
		Object.assign(p, next);
		this.log(`Updated ${p.name}.`);
		return {
			ok: true,
			product: p
		};
	}
	removeProduct(sku) {
		const p = this.getProduct(sku);
		if (!p) return fail("Product not found.");
		this.products.delete(p.sku);
		this.heaps.delete(p.sku);
		this.log(`Removed product ${p.name}.`);
		return { ok: true };
	}
	categories() {
		return [...new Set([...this.products.values()].map((p) => p.category))].sort((a, b) => a.localeCompare(b));
	}
	checkBatch(qty, expiry) {
		const q = Number(qty);
		if (qty === "" || qty == null || !Number.isInteger(q) || q <= 0) return fail("Quantity must be a whole number greater than 0.");
		const exp = expiry ? String(expiry).trim() : "";
		if (exp && !Dates.isValid(exp)) return fail("Expiry date must be a valid date.");
		return {
			ok: true,
			qty: q,
			expiry: exp || null
		};
	}
	addBatch(sku, qty, expiry, receivedDate) {
		const p = this.getProduct(sku);
		if (!p) return fail("Product not found.");
		const c = this.checkBatch(qty, expiry);
		if (!c.ok) return c;
		const batch = {
			id: this.nextBatchId++,
			sku: p.sku,
			qty: c.qty,
			expiry_date: c.expiry,
			received_date: receivedDate || this.today()
		};
		this.heaps.get(p.sku).push(batch);
		this.log(`Received ${c.qty} × ${p.name}.`);
		return {
			ok: true,
			batch
		};
	}
	removeBatch(sku, batchId) {
		const p = this.getProduct(sku);
		if (!p) return fail("Product not found.");
		const heap = this.heaps.get(p.sku);
		const batch = heap.toArray().find((b) => b.id === batchId);
		if (!batch) return fail("Batch not found.");
		heap.removeWhere((b) => b.id === batchId);
		this.log(`Removed a batch of ${batch.qty} × ${p.name}.`);
		return {
			ok: true,
			batch
		};
	}
	batchesOf(sku) {
		const heap = this.heaps.get(normSku(sku));
		return heap ? heap.toArray().sort(batchCmp) : [];
	}
	stockInfo(sku) {
		const p = this.getProduct(sku);
		const heap = p && this.heaps.get(p.sku);
		if (!heap || !p) return null;
		let total = 0;
		let sellable = 0;
		let expired = 0;
		let nextExpiry = null;
		heap.forEach((b) => {
			total += b.qty;
			if (this.isExpired(b)) expired += b.qty;
			else {
				sellable += b.qty;
				if (b.expiry_date && (nextExpiry === null || b.expiry_date < nextExpiry)) nextExpiry = b.expiry_date;
			}
		});
		const status = sellable === 0 ? "out" : sellable <= p.reorder_level ? "low" : "ok";
		return {
			total,
			sellable,
			expired,
			nextExpiry,
			status,
			batches: heap.size()
		};
	}
	listProducts(filters = {}) {
		const q = (filters.q || "").trim().toLowerCase();
		const out = [];
		for (const p of this.products.values()) {
			if (filters.category && p.category !== filters.category) continue;
			if (q && !(p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) continue;
			const info = this.stockInfo(p.sku);
			if (!info) continue;
			if (filters.status && info.status !== filters.status) continue;
			out.push({
				product: p,
				info
			});
		}
		return out;
	}
	reorderList() {
		return this.listProducts().filter((r) => r.info.status !== "ok").sort((a, b) => a.info.status === b.info.status ? a.info.sellable - b.info.sellable : a.info.status === "out" ? -1 : 1);
	}
	addCustomer(input) {
		const name = String(input.name || "").trim();
		if (!name) return fail("Customer name is required.");
		const existing = this.customers.find((c) => c.name.toLowerCase() === name.toLowerCase());
		if (existing) return {
			ok: true,
			customer: existing,
			created: false
		};
		const customer = {
			id: this.nextCustomerId++,
			name,
			phone: String(input.phone || "").trim(),
			notes: String(input.notes || "").trim()
		};
		this.customers.push(customer);
		this.log(`Added customer ${name}.`);
		return {
			ok: true,
			customer,
			created: true
		};
	}
	getCustomer(id) {
		return this.customers.find((c) => c.id === id);
	}
	customerBalance(id) {
		return this.debts.filter((d) => d.customerId === id && d.remaining > 0 && d.status !== "cancelled").reduce((s, d) => s + d.remaining, 0);
	}
	sell(items, opts) {
		if (!Array.isArray(items) || items.length === 0) return fail("The cart is empty.");
		if (opts.payment !== "cash" && opts.payment !== "utang") return fail("Choose cash or utang.");
		const need = /* @__PURE__ */ new Map();
		for (const it of items) {
			const sku = normSku(it.sku);
			const q = Number(it.qty);
			if (!this.products.has(sku)) return fail(`Unknown SKU: ${sku}.`);
			if (!Number.isInteger(q) || q <= 0) return fail(`Invalid quantity for ${sku}.`);
			need.set(sku, (need.get(sku) || 0) + q);
		}
		const shortages = [];
		for (const [sku, q] of need) {
			const info = this.stockInfo(sku);
			if (info.sellable < q) shortages.push({
				sku,
				name: this.products.get(sku).name,
				requested: q,
				available: info.sellable,
				expired: info.expired
			});
		}
		if (shortages.length) return {
			ok: false,
			error: shortages.map((s) => `${s.name}: need ${s.requested}, only ${s.available} sellable` + (s.expired ? ` (${s.expired} expired can't be sold)` : "") + ".").join(" "),
			shortages
		};
		let customer;
		let dueDate;
		if (opts.payment === "utang") {
			if (opts.customerId) customer = this.getCustomer(opts.customerId);
			if (!customer) {
				const added = this.addCustomer({
					name: opts.customerName || "",
					phone: opts.customerPhone
				});
				if (!added.ok) return added;
				customer = added.customer;
			}
			dueDate = opts.dueDate || Dates.addDays(this.today(), this.settings.defaultDebtDays);
			if (!Dates.isValid(dueDate)) return fail("Due date must be a valid date.");
		}
		const lines = [];
		let totalCents = 0;
		for (const [sku, q] of need) {
			const p = this.products.get(sku);
			const heap = this.heaps.get(sku);
			const stash = [];
			const taken = [];
			let left = q;
			while (left > 0 && !heap.isEmpty()) {
				const top = heap.peek();
				if (this.isExpired(top)) {
					stash.push(heap.pop());
					continue;
				}
				const take = Math.min(top.qty, left);
				top.qty -= take;
				left -= take;
				taken.push({
					batch_id: top.id,
					expiry_date: top.expiry_date,
					qty: take
				});
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
				batches: taken
			});
		}
		const sale = {
			id: this.nextSaleId++,
			time: (/* @__PURE__ */ new Date()).toISOString(),
			date: this.today(),
			lines,
			total: totalCents / 100,
			payment: opts.payment,
			customerId: customer?.id,
			customerName: customer?.name,
			status: "complete",
			returns: [],
			refundedAmount: 0
		};
		if (opts.payment === "cash") this.cashEvents.push({
			id: this.nextCashId++,
			type: "sale_cash",
			amount: sale.total,
			time: sale.time,
			date: sale.date,
			note: `Sale #${sale.id}`,
			ref: `sale:${sale.id}`
		});
		else if (customer && dueDate) {
			const debt = {
				id: this.nextDebtId++,
				customerId: customer.id,
				customerName: customer.name,
				saleId: sale.id,
				amount: sale.total,
				remaining: sale.total,
				dueDate,
				createdAt: sale.time,
				status: refreshDebtStatus({
					id: 0,
					customerId: customer.id,
					customerName: customer.name,
					saleId: sale.id,
					amount: sale.total,
					remaining: sale.total,
					dueDate,
					createdAt: sale.time,
					status: "open",
					payments: []
				}, this.today()),
				payments: []
			};
			this.debts.push(debt);
			sale.debtId = debt.id;
		}
		this.sales.push(sale);
		if (this.sales.length > 400) this.sales.shift();
		const payLabel = opts.payment === "cash" ? "cash" : `utang (${customer.name})`;
		this.log(`Sale #${sale.id}: ${lines.reduce((s, l) => s + l.qty, 0)} item(s), ${payLabel}.`);
		return {
			ok: true,
			sale
		};
	}
	remainingLineQty(sale, sku) {
		const line = sale.lines.find((l) => l.sku === sku);
		if (!line) return 0;
		const ret = sale.returns.filter((r) => r.sku === sku).reduce((s, r) => s + r.qty, 0);
		return line.qty - ret;
	}
	returnSale(saleId, items) {
		const sale = this.sales.find((s) => s.id === saleId);
		if (!sale) return fail("Sale not found.");
		if (sale.status === "returned") return fail("This sale was already fully returned.");
		if (!items.length) return fail("Choose items to return.");
		const want = /* @__PURE__ */ new Map();
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
			const line = sale.lines.find((l) => l.sku === sku);
			let left = q;
			const restored = [];
			for (let i = line.batches.length - 1; i >= 0 && left > 0; i--) {
				const take = line.batches[i];
				const give = Math.min(take.qty, left);
				if (give <= 0) continue;
				restored.push({
					expiry: take.expiry_date,
					qty: give
				});
				take.qty -= give;
				left -= give;
			}
			if (left > 0) restored.push({
				expiry: null,
				qty: left
			});
			const heap = this.heaps.get(sku);
			if (heap) for (const r of restored) {
				const existing = heap.toArray().find((b) => b.expiry_date === r.expiry);
				if (existing) existing.qty += r.qty;
				else heap.push({
					id: this.nextBatchId++,
					sku,
					qty: r.qty,
					expiry_date: r.expiry,
					received_date: this.today()
				});
			}
			const amount = toCents(line.price) * q / 100;
			sale.returns.push({
				sku,
				qty: q,
				amount,
				time: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		sale.refundedAmount = round2(sale.refundedAmount + refundCents / 100);
		const fully = sale.lines.every((l) => this.remainingLineQty(sale, l.sku) === 0);
		sale.status = fully ? "returned" : "partial_return";
		const refund = refundCents / 100;
		if (sale.payment === "cash") this.cashEvents.push({
			id: this.nextCashId++,
			type: "refund",
			amount: -refund,
			time: (/* @__PURE__ */ new Date()).toISOString(),
			date: this.today(),
			note: `Wrong order, sale #${sale.id}`,
			ref: `sale:${sale.id}`
		});
		else if (sale.debtId) {
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
						time: (/* @__PURE__ */ new Date()).toISOString(),
						date: this.today(),
						note: `Utang overpay refund, sale #${sale.id}`,
						ref: `debt:${debt.id}`
					});
					debt.remaining = 0;
				} else debt.remaining = round2(newAmount - paid);
				if (fully && debt.remaining === 0 && paid === 0) debt.status = "cancelled";
				else debt.status = refreshDebtStatus(debt, this.today());
			}
		}
		this.log(`Wrong order on sale #${sale.id}: returned ${[...want.values()].reduce((s, n) => s + n, 0)} pc(s).`);
		return {
			ok: true,
			sale,
			refund
		};
	}
	payDebt(debtId, amount) {
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
			time: (/* @__PURE__ */ new Date()).toISOString(),
			note: "Collection"
		});
		debt.status = refreshDebtStatus(debt, this.today());
		this.cashEvents.push({
			id: this.nextCashId++,
			type: "debt_pay",
			amount: pay,
			time: (/* @__PURE__ */ new Date()).toISOString(),
			date: this.today(),
			note: `Utang payment from ${debt.customerName}`,
			ref: `debt:${debt.id}`
		});
		this.log(`Collected ${pay.toFixed(2)} from ${debt.customerName}.`);
		return {
			ok: true,
			debt,
			paid: pay
		};
	}
	expiryReport(days = 14) {
		const all = [];
		for (const heap of this.heaps.values()) heap.forEach((b) => {
			if (b.expiry_date) all.push(b);
		});
		const heap = MinHeap.from(all, batchCmp);
		const today = this.today();
		const expired = [];
		const soon = [];
		while (!heap.isEmpty()) {
			const b = heap.peek();
			const daysLeft = Dates.daysBetween(today, b.expiry_date);
			if (daysLeft > days) break;
			heap.pop();
			const product = this.products.get(b.sku);
			const row = {
				batch: b,
				product,
				daysLeft,
				value: round2(b.qty * product.price)
			};
			(daysLeft < 0 ? expired : soon).push(row);
		}
		return {
			expired,
			soon,
			examined: all.length
		};
	}
	pullOutExpired() {
		const items = [];
		let batches = 0;
		let qty = 0;
		let lossCents = 0;
		for (const [sku, heap] of this.heaps) {
			const p = this.products.get(sku);
			while (!heap.isEmpty() && this.isExpired(heap.peek())) {
				const b = heap.pop();
				batches++;
				qty += b.qty;
				const value = toCents(p.price) * b.qty / 100;
				lossCents += toCents(p.price) * b.qty;
				items.push({
					sku,
					name: p.name,
					qty: b.qty,
					expiry_date: b.expiry_date,
					value
				});
			}
		}
		const loss = lossCents / 100;
		if (batches) {
			const rec = {
				id: this.nextPulloutId++,
				time: (/* @__PURE__ */ new Date()).toISOString(),
				date: this.today(),
				batches,
				qty,
				loss,
				items
			};
			this.pullouts.push(rec);
			this.log(`Pulled out ${batches} expired batch(es), ${qty} pcs.`);
		}
		return {
			ok: true,
			batches,
			qty,
			loss,
			items
		};
	}
	summary(report) {
		const rep = report || this.expiryReport(this.settings.expiryWarningDays);
		let low = 0;
		let out = 0;
		let valueCents = 0;
		for (const p of this.products.values()) {
			const info = this.stockInfo(p.sku);
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
			openUtang: this.debts.filter((d) => d.remaining > 0 && d.status !== "cancelled").length
		};
	}
	financeSummary() {
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
			const info = this.stockInfo(p.sku);
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
			overdueDebts: openDebts.filter((d) => d.dueDate <= today).length
		};
	}
	openDebts() {
		const today = this.today();
		return this.debts.map((d) => ({
			...d,
			status: refreshDebtStatus(d, today)
		})).filter((d) => d.remaining > 0 && d.status !== "cancelled").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
	}
	toJSON() {
		const batches = [];
		for (const heap of this.heaps.values()) heap.forEach((b) => batches.push({ ...b }));
		return {
			format: "store-inventory-state",
			version: 3,
			saved_at: (/* @__PURE__ */ new Date()).toISOString(),
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
			cashEvents: this.cashEvents
		};
	}
	load(obj) {
		if (!obj || obj.format !== "store-inventory-state" || !Array.isArray(obj.products) || !Array.isArray(obj.batches)) throw new Error("This is not a saved inventory file.");
		this._reset();
		if (obj.settings && typeof obj.settings === "object") this.settings = {
			...DEFAULT_SETTINGS,
			...obj.settings
		};
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
				received_date: b.received_date || this.today()
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
		this.nextCustomerId = Math.max(Number(obj.nextCustomerId) || 1, this.customers.reduce((m, c) => Math.max(m, c.id), 0) + 1);
		this.nextDebtId = Math.max(Number(obj.nextDebtId) || 1, this.debts.reduce((m, d) => Math.max(m, d.id), 0) + 1);
		this.nextPaymentId = Math.max(Number(obj.nextPaymentId) || 1, this.debts.reduce((m, d) => Math.max(m, ...(d.payments || []).map((p) => p.id), 0), 0) + 1);
		this.nextPulloutId = Math.max(Number(obj.nextPulloutId) || 1, this.pullouts.reduce((m, p) => Math.max(m, p.id), 0) + 1);
		this.nextCashId = Math.max(Number(obj.nextCashId) || 1, this.cashEvents.reduce((m, e) => Math.max(m, e.id), 0) + 1);
	}
	importSeed(seed) {
		if (!seed || !Array.isArray(seed.products)) throw new Error("The file needs a \"products\" list.");
		this._reset();
		const today = this.today();
		const errors = [];
		for (const sp of seed.products) {
			const r = this.addProduct(sp);
			if (!r.ok) {
				errors.push(`${sp.sku}: ${r.error}`);
				continue;
			}
			for (const b of sp.batches || []) {
				const exp = b.expiry_in_days != null ? Dates.addDays(today, Number(b.expiry_in_days)) : b.expiry_date || null;
				const rb = this.addBatch(r.product.sku, b.qty, exp);
				if (!rb.ok) errors.push(`${sp.sku}: ${rb.error}`);
			}
		}
		this.activity = [];
		this.sales = [];
		this.log(`Loaded ${this.products.size} sample products.`);
		return {
			ok: true,
			added: this.products.size,
			errors
		};
	}
	importAny(obj) {
		if (obj && "format" in obj && obj.format === "store-inventory-state") {
			this.load(obj);
			return {
				ok: true,
				errors: []
			};
		}
		return this.importSeed(obj);
	}
};
function normalizeSale(s) {
	return {
		...s,
		payment: s.payment === "utang" ? "utang" : "cash",
		status: s.status || "complete",
		returns: Array.isArray(s.returns) ? s.returns : [],
		refundedAmount: s.refundedAmount || 0,
		lines: (s.lines || []).map((l) => ({
			...l,
			cost: l.cost || 0,
			batches: l.batches || []
		}))
	};
}
function c(price) {
	return Math.round(price * .72 * 100) / 100;
}
var SEED_PRODUCTS = [
	{
		sku: "RICE-001",
		name: "Sinandomeng rice (per kg)",
		category: "Rice",
		price: 56,
		cost: c(56),
		reorder_level: 20,
		batches: [{
			qty: 40,
			expiry_in_days: 150
		}]
	},
	{
		sku: "RICE-002",
		name: "Jasmine rice (per kg)",
		category: "Rice",
		price: 62,
		cost: c(62),
		reorder_level: 15,
		batches: [{
			qty: 12,
			expiry_in_days: 140
		}]
	},
	{
		sku: "CAN-001",
		name: "Corned beef 150g",
		category: "Canned goods",
		price: 38,
		cost: c(38),
		reorder_level: 10,
		batches: [{
			qty: 6,
			expiry_in_days: -3
		}, {
			qty: 10,
			expiry_in_days: 300
		}]
	},
	{
		sku: "CAN-002",
		name: "Sardines in tomato sauce 155g",
		category: "Canned goods",
		price: 24,
		cost: c(24),
		reorder_level: 10,
		batches: [{
			qty: 24,
			expiry_in_days: 260
		}]
	},
	{
		sku: "CAN-003",
		name: "Tuna flakes 155g",
		category: "Canned goods",
		price: 36,
		cost: c(36),
		reorder_level: 8,
		batches: [{
			qty: 9,
			expiry_in_days: 6
		}, {
			qty: 12,
			expiry_in_days: 400
		}]
	},
	{
		sku: "CAN-004",
		name: "Sardines green 155g",
		category: "Canned goods",
		price: 22,
		cost: c(22),
		reorder_level: 10,
		batches: [{
			qty: 18,
			expiry_in_days: 240
		}]
	},
	{
		sku: "NOO-001",
		name: "Instant pancit canton 60g",
		category: "Noodles",
		price: 16,
		cost: c(16),
		reorder_level: 20,
		batches: [{
			qty: 30,
			expiry_in_days: 170
		}, {
			qty: 15,
			expiry_in_days: 60
		}]
	},
	{
		sku: "NOO-002",
		name: "Instant mami beef 55g",
		category: "Noodles",
		price: 14,
		cost: c(14),
		reorder_level: 15,
		batches: [{
			qty: 8,
			expiry_in_days: -10
		}]
	},
	{
		sku: "SNK-001",
		name: "Cheese potato chips 40g",
		category: "Snacks",
		price: 20,
		cost: c(20),
		reorder_level: 10,
		batches: [{
			qty: 18,
			expiry_in_days: 75
		}]
	},
	{
		sku: "SNK-002",
		name: "BBQ corn chips 27g",
		category: "Snacks",
		price: 10,
		cost: c(10),
		reorder_level: 12,
		batches: [{
			qty: 5,
			expiry_in_days: 11
		}]
	},
	{
		sku: "SNK-003",
		name: "Cheddar corn snack 40g",
		category: "Snacks",
		price: 18,
		cost: c(18),
		reorder_level: 10,
		batches: [{
			qty: 14,
			expiry_in_days: 9
		}, {
			qty: 20,
			expiry_in_days: 80
		}]
	},
	{
		sku: "SNK-004",
		name: "Plain crackers 10s",
		category: "Snacks",
		price: 62,
		cost: c(62),
		reorder_level: 5,
		batches: [{
			qty: 10,
			expiry_in_days: 120
		}]
	},
	{
		sku: "BEV-001",
		name: "Cola 1.5L",
		category: "Beverages",
		price: 75,
		cost: c(75),
		reorder_level: 6,
		batches: [{
			qty: 18,
			expiry_in_days: 130
		}]
	},
	{
		sku: "BEV-002",
		name: "Orange soda 500ml",
		category: "Beverages",
		price: 25,
		cost: c(25),
		reorder_level: 8,
		batches: []
	},
	{
		sku: "BEV-003",
		name: "Orange juice drink 200ml",
		category: "Beverages",
		price: 12,
		cost: c(12),
		reorder_level: 10,
		batches: [{
			qty: 40,
			expiry_in_days: 200
		}]
	},
	{
		sku: "ALC-001",
		name: "Beer 500ml bottle",
		category: "Alcohol",
		price: 55,
		cost: c(55),
		reorder_level: 12,
		batches: [{ qty: 36 }]
	},
	{
		sku: "ALC-002",
		name: "Beer 330ml can",
		category: "Alcohol",
		price: 45,
		cost: c(45),
		reorder_level: 12,
		batches: [{ qty: 24 }]
	},
	{
		sku: "ALC-003",
		name: "Rhum 350ml",
		category: "Alcohol",
		price: 95,
		cost: c(95),
		reorder_level: 6,
		batches: [{ qty: 10 }]
	},
	{
		sku: "CIG-001",
		name: "Cigarettes red pack",
		category: "Cigarettes",
		price: 145,
		cost: c(145),
		reorder_level: 5,
		batches: [{ qty: 20 }]
	},
	{
		sku: "CIG-002",
		name: "Cigarettes menthol pack",
		category: "Cigarettes",
		price: 140,
		cost: c(140),
		reorder_level: 5,
		batches: [{ qty: 4 }]
	},
	{
		sku: "CON-001",
		name: "Cane vinegar 385ml",
		category: "Condiments",
		price: 20,
		cost: c(20),
		reorder_level: 8,
		batches: [{
			qty: 20,
			expiry_in_days: 500
		}]
	},
	{
		sku: "CON-002",
		name: "Soy sauce 385ml",
		category: "Condiments",
		price: 22,
		cost: c(22),
		reorder_level: 8,
		batches: [{
			qty: 16,
			expiry_in_days: 480
		}]
	},
	{
		sku: "COF-001",
		name: "Brown coffee sachet",
		category: "Coffee and milk",
		price: 8,
		cost: c(8),
		reorder_level: 30,
		batches: [{
			qty: 60,
			expiry_in_days: 220
		}]
	},
	{
		sku: "COF-002",
		name: "Powdered milk 33g",
		category: "Coffee and milk",
		price: 15,
		cost: c(15),
		reorder_level: 15,
		batches: [{
			qty: 20,
			expiry_in_days: 3
		}, {
			qty: 25,
			expiry_in_days: 190
		}]
	},
	{
		sku: "HOU-001",
		name: "Detergent powder sachet",
		category: "Household",
		price: 9,
		cost: c(9),
		reorder_level: 20,
		batches: [{ qty: 50 }]
	},
	{
		sku: "HOU-002",
		name: "Bath soap bar",
		category: "Household",
		price: 28,
		cost: c(28),
		reorder_level: 8,
		batches: [{ qty: 10 }]
	}
];
function loadSample(inv) {
	inv.importSeed({ products: SEED_PRODUCTS });
	seedDemoLedger(inv);
}
function seedDemoLedger(inv) {
	const today = inv.today();
	inv.addCustomer({
		name: "Aling Rosa",
		phone: "0917 555 0101"
	});
	inv.addCustomer({
		name: "Mang Ben",
		phone: "0918 555 0144"
	});
	inv.addCustomer({
		name: "Jenny Cruz",
		phone: "0920 555 0199"
	});
	inv.sell([{
		sku: "SNK-001",
		qty: 2
	}, {
		sku: "BEV-001",
		qty: 1
	}], { payment: "cash" });
	inv.sell([{
		sku: "CAN-002",
		qty: 4
	}, {
		sku: "RICE-001",
		qty: 5
	}], {
		payment: "utang",
		customerName: "Aling Rosa",
		dueDate: Dates.addDays(today, -2)
	});
	inv.sell([{
		sku: "ALC-001",
		qty: 2
	}], {
		payment: "utang",
		customerName: "Mang Ben",
		dueDate: Dates.addDays(today, 10)
	});
	inv.sell([{
		sku: "COF-001",
		qty: 10
	}, {
		sku: "HOU-001",
		qty: 6
	}], { payment: "cash" });
	const ben = inv.debts.find((d) => d.customerName === "Mang Ben");
	if (ben) inv.payDebt(ben.id, 40);
	inv.activity = [];
	inv.log("Sample store loaded — including a few sales and utang.");
}
var engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });
function getEngine() {
	return engine;
}
function persistEngine() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(engine.toJSON()));
		return true;
	} catch {
		return false;
	}
}
var useApp = create((set, get) => ({
	ready: false,
	revision: 0,
	view: "inventory",
	cart: [],
	lastSaleId: null,
	filters: {
		q: "",
		category: "",
		status: ""
	},
	billSearch: "",
	notifyOpen: true,
	hydrate: () => {
		engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });
		let loaded = false;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				engine.load(JSON.parse(raw));
				loaded = true;
			}
		} catch {
			loaded = false;
		}
		if (!loaded) {
			loadSample(engine);
			persistEngine();
		}
		const theme = engine.settings.theme || "light";
		document.documentElement.setAttribute("data-theme", theme);
		set({
			ready: true,
			revision: get().revision + 1,
			notifyOpen: engine.settings.notificationsEnabled
		});
	},
	persist: () => {
		persistEngine();
	},
	bump: () => set({ revision: get().revision + 1 }),
	mutate: (fn) => {
		fn(engine);
		persistEngine();
		set({ revision: get().revision + 1 });
	},
	setView: (view) => set({ view }),
	setFilters: (f) => set({ filters: {
		...get().filters,
		...f
	} }),
	setBillSearch: (q) => set({ billSearch: q }),
	setCart: (cart) => set({ cart }),
	setLastSale: (id) => set({ lastSaleId: id }),
	setNotifyOpen: (open) => {
		engine.settings.notificationsEnabled = open;
		persistEngine();
		set({
			notifyOpen: open,
			revision: get().revision + 1
		});
	},
	updateSettings: (patch) => {
		Object.assign(engine.settings, patch);
		if (patch.theme) document.documentElement.setAttribute("data-theme", patch.theme);
		persistEngine();
		set({
			notifyOpen: engine.settings.notificationsEnabled,
			revision: get().revision + 1
		});
	},
	resetSample: () => {
		engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });
		loadSample(engine);
		persistEngine();
		set({
			cart: [],
			lastSaleId: null,
			revision: get().revision + 1
		});
	},
	importData: (obj) => {
		const r = engine.importAny(obj);
		persistEngine();
		set({
			cart: [],
			lastSaleId: null,
			revision: get().revision + 1
		});
		return {
			ok: true,
			errors: r.errors || []
		};
	}
}));
function BillingView() {
	useApp((s) => s.revision);
	const cart = useApp((s) => s.cart);
	const setCart = useApp((s) => s.setCart);
	const billSearch = useApp((s) => s.billSearch);
	const setBillSearch = useApp((s) => s.setBillSearch);
	const lastSaleId = useApp((s) => s.lastSaleId);
	const setLastSale = useApp((s) => s.setLastSale);
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const [skuInput, setSkuInput] = (0, import_react.useState)("");
	const [checkoutOpen, setCheckoutOpen] = (0, import_react.useState)(false);
	const [returnSale, setReturnSale] = (0, import_react.useState)(null);
	const results = inv.listProducts({ q: billSearch }).slice(0, 40);
	const allResults = inv.listProducts({ q: billSearch });
	const lines = cart.map((l) => {
		const p = inv.getProduct(l.sku);
		if (!p) return null;
		return {
			...l,
			product: p,
			amount: Math.round(p.price * 100) * l.qty / 100
		};
	}).filter((l) => !!l);
	const totalCents = lines.reduce((s, l) => s + Math.round(l.product.price * 100) * l.qty, 0);
	const sale = lastSaleId != null ? inv.sales.find((s) => s.id === lastSaleId) : inv.sales[inv.sales.length - 1];
	const recent = [...inv.sales].slice(-8).reverse();
	function addToCart(sku, n = 1) {
		const p = inv.getProduct(sku);
		if (!p) return false;
		const info = inv.stockInfo(p.sku);
		const line = cart.find((l) => l.sku === p.sku);
		if ((line ? line.qty : 0) + n > info.sellable) {
			toast.error(info.sellable === 0 ? `${p.name} has no sellable stock${info.expired ? " (only expired batches are left)" : ""}.` : `Only ${info.sellable} of ${p.name} available.`);
			return false;
		}
		if (line) setCart(cart.map((l) => l.sku === p.sku ? {
			...l,
			qty: l.qty + n
		} : l));
		else setCart([...cart, {
			sku: p.sku,
			qty: n
		}]);
		return true;
	}
	function printSlip() {
		document.body.dataset.print = "slip";
		window.print();
		const done = () => {
			delete document.body.dataset.print;
			window.removeEventListener("afterprint", done);
		};
		window.addEventListener("afterprint", done);
		setTimeout(done, 1e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "New sale",
					subtitle: "Type or scan a SKU and press Enter, or pick a product below.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2.5 border-y border-border bg-surface-2 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "SKU, then Enter",
							"aria-label": "SKU to add to cart",
							value: skuInput,
							onChange: (e) => setSkuInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key !== "Enter") return;
								e.preventDefault();
								const v = skuInput.trim();
								if (!v) return;
								const p = inv.getProduct(v);
								if (!p) {
									toast.error(`No product has the SKU "${v.toUpperCase()}".`);
									return;
								}
								if (addToCart(p.sku, 1)) setSkuInput("");
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "search",
							placeholder: "Search by name",
							"aria-label": "Search products by name",
							value: billSearch,
							onChange: (e) => setBillSearch(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[340px] overflow-y-auto",
						children: [
							results.map(({ product: p, info }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: info.sellable === 0,
								onClick: () => addToCart(p.sku, 1),
								className: "flex w-full items-center justify-between gap-3 border-t border-border px-5 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-sm",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
									className: "text-muted",
									children: [
										p.sku,
										", ",
										p.category
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-right tabular-nums",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "block text-sm",
										children: peso(p.price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: info.sellable ? `${info.sellable} available` : info.expired ? "Expired only" : "Out of stock"
									})]
								})]
							}, p.sku)),
							allResults.length > results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "px-5 py-3 text-sm text-muted",
								children: [
									"Showing the first ",
									results.length,
									" of ",
									allResults.length,
									". Narrow the search to see more."
								]
							}) : null,
							allResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
								title: "No products found",
								body: "Check the spelling or try the SKU."
							}) : null
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Cart",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: !lines.length,
						onClick: () => setCart([]),
						children: "Clear cart"
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-x-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border bg-surface-2 text-left text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-2.5 font-medium",
											children: "Item"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2.5 text-right font-medium",
											children: "Price"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2.5 text-right font-medium",
											children: "Qty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2.5 text-right font-medium",
											children: "Amount"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2.5" })
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold",
												children: l.product.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-xs text-muted",
												children: l.sku
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right tabular-nums",
											children: peso(l.product.price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "ml-auto h-9 w-[72px] text-center",
												type: "number",
												min: 1,
												step: 1,
												value: l.qty,
												"aria-label": `Quantity of ${l.product.name}`,
												onChange: (e) => {
													const max = inv.stockInfo(l.sku)?.sellable ?? 0;
													let q = parseInt(e.target.value, 10);
													if (!Number.isInteger(q) || q < 1) q = 1;
													if (max < 1) setCart(cart.filter((x) => x.sku !== l.sku));
													else {
														if (q > max) {
															q = max;
															toast.error(`Only ${max} available.`);
														}
														setCart(cart.map((x) => x.sku === l.sku ? {
															...x,
															qty: q
														} : x));
													}
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right tabular-nums",
											children: peso(l.amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon-sm",
												"aria-label": `Remove ${l.product.name}`,
												onClick: () => setCart(cart.filter((x) => x.sku !== l.sku)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
											})
										})
									]
								}, l.sku)) })]
							}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
								title: "The cart is empty",
								body: "Add items by SKU or from the list."
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between border-t border-border px-5 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-display text-3xl tabular-nums",
								children: peso(totalCents / 100)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 pt-2 pb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-12 w-full",
								disabled: !lines.length,
								onClick: () => setCheckoutOpen(true),
								children: "Complete sale"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Sales slip",
					subtitle: "An itemized record for the customer. Not an official receipt.",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						disabled: !sale,
						onClick: printSlip,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Print slip"]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "sales-slip",
						className: "mx-5 mb-5 max-w-[340px] rounded-md border border-dashed border-muted bg-white p-4 font-mono text-[13px] text-zinc-900",
						children: sale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-center font-sans text-base font-semibold",
								children: inv.settings.storeName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center",
								children: ["Sales slip #", sale.id]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center",
								children: fmtTime(sale.time)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-xs uppercase tracking-wide",
								children: [sale.payment === "utang" ? `UTANG · ${sale.customerName}` : "CASH", sale.status !== "complete" ? ` · ${sale.status === "returned" ? "RETURNED" : "PARTIAL RETURN"}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2.5 border-dashed border-zinc-500" }),
							sale.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									l.qty,
									" × ",
									l.name
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: peso(l.amount) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 pl-3 text-zinc-500",
								children: ["@ ", peso(l.price)]
							})] }, l.sku)),
							sale.refundedAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-zinc-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Returned" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−", peso(sale.refundedAmount)] })]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2.5 border-dashed border-zinc-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-base font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: peso(sale.total - (sale.refundedAmount || 0)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-[11px] text-zinc-500",
								children: inv.settings.slipFooter
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-muted",
							children: "Complete a sale to see its itemized slip here."
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Recent sales",
					children: recent.length ? recent.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-t border-border px-3 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setLastSale(s.id),
							className: `flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-accent-soft ${sale?.id === s.id ? "bg-accent-soft" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate",
									children: [
										"#",
										s.id,
										" · ",
										fmtTime(s.time)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted",
									children: [s.payment === "utang" ? `Utang · ${s.customerName}` : "Cash", s.status !== "complete" ? " · returned" : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "tabular-nums",
								children: peso(s.total - (s.refundedAmount || 0))
							})]
						}), s.status !== "returned" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							title: "Wrong order",
							"aria-label": "Wrong order",
							onClick: () => setReturnSale(s),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "neutral",
							children: "Returned"
						})]
					}, s.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No sales yet",
						body: "Sales you complete will be listed here."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutDialog, {
				open: checkoutOpen,
				total: totalCents / 100,
				onClose: () => setCheckoutOpen(false),
				onConfirm: (opts) => {
					mutate((eng) => {
						const r = eng.sell(lines.map((l) => ({
							sku: l.sku,
							qty: l.qty
						})), opts);
						if (!r.ok) {
							toast.error(r.error);
							return;
						}
						setCart([]);
						setLastSale(r.sale.id);
						setCheckoutOpen(false);
						toast.success(r.sale.payment === "utang" ? `Sale #${r.sale.id} on utang for ${r.sale.customerName}: ${peso(r.sale.total)}` : `Sale #${r.sale.id} complete (cash): ${peso(r.sale.total)}`);
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnDialog, {
				sale: returnSale,
				onClose: () => setReturnSale(null)
			})
		]
	});
}
function CheckoutDialog({ open, total, onClose, onConfirm }) {
	useApp((s) => s.revision);
	const inv = getEngine();
	const [payment, setPayment] = (0, import_react.useState)("cash");
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)(Dates.addDays(inv.today(), inv.settings.defaultDebtDays));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => {
			if (!o) onClose();
			else {
				setPayment("cash");
				setCustomerId("");
				setNewName("");
				setPhone("");
				setDue(Dates.addDays(inv.today(), inv.settings.defaultDebtDays));
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			title: "How is this paid?",
			description: `Total ${peso(total)}. Choose cash or utang before the sale is recorded.`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPayment("cash"),
						className: `rounded-xl border px-4 py-3 text-left ${payment === "cash" ? "border-accent bg-accent-soft" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "block",
							children: "Cash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: "Paid now, added to earned money."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPayment("utang"),
						className: `rounded-xl border px-4 py-3 text-left ${payment === "utang" ? "border-accent bg-accent-soft" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "block",
							children: "Utang"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: "On account, due on a deadline."
						})]
					})]
				}),
				payment === "utang" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Existing customer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm",
								value: customerId,
								onChange: (e) => setCustomerId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "New customer…"
								}), inv.customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [c.name, inv.customerBalance(c.id) ? ` · ${peso(inv.customerBalance(c.id))} open` : ""]
								}, c.id))]
							})
						}),
						!customerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Customer name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: newName,
									onChange: (e) => setNewName(e.target.value),
									placeholder: "e.g. Aling Rosa"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: phone,
									onChange: (e) => setPhone(e.target.value)
								})
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Due date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: due,
								onChange: (e) => setDue(e.target.value)
							})
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						if (payment === "utang" && !customerId && !newName.trim()) {
							toast.error("Enter the customer’s name for utang.");
							return;
						}
						onConfirm({
							payment,
							customerId: customerId ? Number(customerId) : void 0,
							customerName: newName,
							customerPhone: phone,
							dueDate: due
						});
					},
					children: [
						"Record ",
						payment === "cash" ? "cash" : "utang",
						" sale"
					]
				})] })
			]
		})
	});
}
function ReturnDialog({ sale, onClose }) {
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const live = sale ? inv.sales.find((s) => s.id === sale.id) : null;
	const [qty, setQty] = (0, import_react.useState)({});
	const open = !!live;
	const defaults = live ? Object.fromEntries(live.lines.map((l) => [l.sku, inv.remainingLineQty(live, l.sku)])) : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => {
			if (!o) onClose();
			else if (live) setQty(defaults);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Wrong order",
			description: "The customer came back with the wrong items. Returned stock goes back on the shelf, cash is refunded, and utang is reduced.",
			children: live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [live.lines.map((l) => {
					const left = inv.remainingLineQty(live, l.sku);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: l.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								"Sold ",
								l.qty,
								left < l.qty ? ` · ${l.qty - left} already returned` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Return qty",
							className: "w-24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								max: left,
								step: 1,
								value: qty[l.sku] ?? left,
								onChange: (e) => setQty({
									...qty,
									[l.sku]: Number(e.target.value)
								})
							})
						})]
					}, l.sku);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: onClose,
					children: "Keep sale"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => {
						const items = live.lines.map((l) => ({
							sku: l.sku,
							qty: qty[l.sku] ?? inv.remainingLineQty(live, l.sku)
						})).filter((x) => x.qty > 0);
						if (!items.length) {
							toast.error("Choose at least one item to return.");
							return;
						}
						mutate((eng) => {
							const r = eng.returnSale(live.id, items);
							if (!r.ok) {
								toast.error(r.error);
								return;
							}
							toast.success(`Returned ${peso(r.refund)} from sale #${live.id}.`);
							onClose();
						});
					},
					children: "Record return"
				})] })]
			}) : null
		})
	});
}
function ExpiryView() {
	useApp((s) => s.revision);
	const mutate = useApp((s) => s.mutate);
	const updateSettings = useApp((s) => s.updateSettings);
	const inv = getEngine();
	const days = inv.settings.expiryWarningDays;
	const report = inv.expiryReport(days);
	const lossValue = report.expired.reduce((s, r) => s + r.value, 0);
	const soonValue = report.soon.reduce((s, r) => s + r.value, 0);
	function row(r) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-t border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-5 py-3 font-semibold",
					children: r.product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-3 font-mono text-xs",
					children: r.product.sku
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-3 text-right tabular-nums",
					children: r.batch.qty
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-3",
					children: fmtDate(r.batch.expiry_date)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: r.daysLeft < 0 ? "bad" : r.daysLeft <= days ? "warn" : "neutral",
						children: dayLabel(r.daysLeft)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-5 py-3 text-right tabular-nums",
					children: peso(r.value)
				})
			]
		}, r.batch.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Expired batches",
						value: report.expired.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
						tone: "red",
						note: "Cannot be sold",
						emphasis: report.expired.length > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: `Expiring within ${days} days`,
						value: report.soon.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
						tone: "amber",
						note: `${peso(soonValue)} at selling price`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Loss if pulled out today",
						value: peso(lossValue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4" }),
						tone: "red",
						note: "At selling price, not cost"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Expired stock",
				subtitle: "Expired batches cannot be sold. Pull them out to clear the shelf and record the loss.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					disabled: !report.expired.length,
					onClick: () => {
						if (!confirm(`Pull out ${report.expired.length} expired batch(es)? They will be removed from stock.`)) return;
						mutate((eng) => {
							const r = eng.pullOutExpired();
							toast.success(`Pulled out ${r.qty} pcs. Estimated loss ${peso(r.loss)}.`);
						});
					},
					children: "Pull out all expired"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-y border-border bg-surface-2 text-left text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 font-medium",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "SKU"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 text-right font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Expired on"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Overdue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 text-right font-medium",
									children: "Value at price"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: report.expired.map(row) })]
					}), report.expired.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "Nothing has expired",
						body: "Every batch on the shelf is still good."
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Expiring soon",
				subtitle: "Earliest first. Sell or discount these before the rest.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex items-center gap-2 text-sm text-muted",
					children: [
						"Warn within",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							max: 365,
							step: 1,
							className: "h-10 w-[76px] rounded-lg border border-border bg-surface-2 px-2 text-fg",
							value: days,
							onChange: (e) => {
								let d = parseInt(e.target.value, 10);
								if (!Number.isInteger(d) || d < 1) d = 1;
								if (d > 365) d = 365;
								updateSettings({ expiryWarningDays: d });
							}
						}),
						"days"
					]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-y border-border bg-surface-2 text-left text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 font-medium",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "SKU"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 text-right font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Expires on"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Time left"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 text-right font-medium",
									children: "Value at price"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: report.soon.map(row) })]
					}), report.soon.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "Nothing expires soon",
						body: "Try a longer warning window."
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-r-lg border-l-4 border-accent bg-surface px-4 py-3 text-sm text-muted",
				children: [
					"Near-expiration alerts start ",
					days,
					" days out (change this here or in Settings). Selling always takes the batch that expires first (FEFO). ",
					report.examined,
					" dated batches were checked; ",
					report.expired.length + report.soon.length,
					" sit inside the window."
				]
			})
		]
	});
}
function tokenize(text) {
	const src = String(text).replace(/×/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-").replace(/,/g, "");
	const tokens = [];
	let i = 0;
	while (i < src.length) {
		const c = src[i];
		if (/\s/.test(c)) {
			i++;
			continue;
		}
		if (/[0-9.]/.test(c)) {
			let j = i;
			while (j < src.length && /[0-9.]/.test(src[j])) j++;
			const raw = src.slice(i, j);
			if ((raw.match(/\./g) || []).length > 1 || raw === ".") throw new Error("That number is not valid.");
			tokens.push({
				t: "num",
				v: parseFloat(raw)
			});
			i = j;
			continue;
		}
		if ("+-*/()%".includes(c)) {
			tokens.push({ t: c });
			i++;
			continue;
		}
		throw new Error(`Unexpected "${c}".`);
	}
	return tokens;
}
function evaluate(text) {
	try {
		const tokens = tokenize(text);
		if (tokens.length === 0) return {
			ok: false,
			error: "Type a calculation."
		};
		let pos = 0;
		const peek = () => tokens[pos];
		const take = () => tokens[pos++];
		function parseExpr() {
			let left = parseTerm();
			while (peek() && (peek().t === "+" || peek().t === "-")) {
				const op = take().t;
				const right = parseTerm();
				const rv = right.pct ? left.v * right.v : right.v;
				left = {
					v: op === "+" ? left.v + rv : left.v - rv,
					pct: false
				};
			}
			return left;
		}
		function parseTerm() {
			let left = parseUnary();
			while (peek() && (peek().t === "*" || peek().t === "/")) {
				const op = take().t;
				const right = parseUnary();
				if (op === "/" && right.v === 0) throw new Error("Cannot divide by zero.");
				left = {
					v: op === "*" ? left.v * right.v : left.v / right.v,
					pct: false
				};
			}
			return left;
		}
		function parseUnary() {
			const t = peek();
			if (t && (t.t === "-" || t.t === "+")) {
				take();
				const inner = parseUnary();
				return {
					v: t.t === "-" ? -inner.v : inner.v,
					pct: inner.pct
				};
			}
			return parsePostfix();
		}
		function parsePostfix() {
			const p = parsePrimary();
			if (peek() && peek().t === "%") {
				take();
				return {
					v: p.v / 100,
					pct: true
				};
			}
			return p;
		}
		function parsePrimary() {
			const t = take();
			if (!t) throw new Error("The calculation is not finished.");
			if (t.t === "num") return {
				v: t.v ?? 0,
				pct: false
			};
			if (t.t === "(") {
				const inner = parseExpr();
				if (!peek() || peek().t !== ")") throw new Error("A bracket is not closed.");
				take();
				return {
					v: inner.v,
					pct: false
				};
			}
			throw new Error("The calculation is not valid.");
		}
		const result = parseExpr();
		if (pos < tokens.length) throw new Error(tokens[pos].t === ")" ? "There is an extra closing bracket." : "The calculation is not valid.");
		if (!Number.isFinite(result.v)) throw new Error("The result is too large.");
		return {
			ok: true,
			value: Number(result.v.toPrecision(12))
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "The calculation is not valid."
		};
	}
}
function FinanceView() {
	useApp((s) => s.revision);
	const inv = getEngine();
	const f = inv.financeSummary();
	const composition = [
		{
			name: "Cash collected",
			value: Math.max(0, f.earnedMoney),
			fill: "var(--accent)"
		},
		{
			name: "Utang (assets)",
			value: f.utangAssets,
			fill: "var(--info)"
		},
		{
			name: "Inventory at cost",
			value: f.inventoryCost,
			fill: "var(--ok)"
		}
	].filter((d) => d.value > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Profit gain",
						value: peso(f.profitGain),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }),
						tone: "green",
						note: "Sales minus cost of goods and expiry losses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Net worth",
						value: peso(f.netWorth),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }),
						tone: "teal",
						note: "Cash + open utang + inventory at cost"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Net loss (expirations)",
						value: peso(f.expiryLoss),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4" }),
						tone: "red",
						note: `${inv.pullouts.length} pull-out${inv.pullouts.length === 1 ? "" : "s"} recorded`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assets (utang)",
						value: peso(f.utangAssets),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }),
						tone: "amber",
						note: `${f.openDebts} open · ${f.overdueDebts} overdue`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Earned money",
						value: peso(f.earnedMoney),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "size-4" }),
						note: "Cash sales + collections − refunds"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Overall summary",
					subtitle: "Running picture of the till, not a BIR report.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-0 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Gross sales (after returns)",
								v: peso(f.grossSales)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Cash sales",
								v: peso(f.cashSales)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Utang sales",
								v: peso(f.utangSales)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Cost of goods sold",
								v: peso(f.cogs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Collections on utang",
								v: peso(f.collections)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Refunds (wrong orders)",
								v: peso(f.refunds)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Expiry losses",
								v: peso(f.expiryLoss)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Inventory at selling price",
								v: peso(f.inventoryRetail)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Inventory at cost",
								v: peso(f.inventoryCost)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Profit gain",
								v: peso(f.profitGain),
								strong: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Net worth",
								v: peso(f.netWorth),
								strong: true
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-4 text-xs text-muted",
						children: "Profit uses each product’s cost. Sample items are seeded at about 72% of selling price. Cash is running collections in this browser, not a bank balance."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Where the money sits",
					children: [composition.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[240px] px-2 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: composition,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 58,
								outerRadius: 88,
								paddingAngle: 3,
								children: composition.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, d.name))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => peso(v) })] })
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No balances yet",
						body: "Complete a sale to see the mix."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-1.5 px-5 pb-4 text-sm",
						children: composition.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded-full",
									style: { background: d.fill }
								}), d.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: peso(d.value)
							})]
						}, d.name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Expiry losses",
					subtitle: "Pull-outs of expired stock, valued at selling price.",
					children: inv.pullouts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-y border-border bg-surface-2 text-left text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-2.5 font-medium",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-medium",
										children: "Batches"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-medium",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-2.5 text-right font-medium",
										children: "Loss"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...inv.pullouts].reverse().map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-2.5",
										children: fmtDate(p.date)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2.5 text-right tabular-nums",
										children: p.batches
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2.5 text-right tabular-nums",
										children: p.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-2.5 text-right tabular-nums",
										children: peso(p.loss)
									})
								]
							}, p.id)) })]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No expiry losses yet",
						body: "Pull out expired batches from Expiry watch to record them here."
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopCalculator, {})]
			})
		]
	});
}
function Row({ k, v, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center justify-between gap-3 border-t border-border px-5 py-2.5", strong && "bg-surface-2 font-semibold"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: strong ? "text-fg" : "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums",
			children: v
		})]
	});
}
function ShopCalculator() {
	const [expr, setExpr] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("0");
	const [err, setErr] = (0, import_react.useState)("");
	function press(ch) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Calculator",
		subtitle: "Percent works like a shop till: 200 + 10% = 220.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 rounded-xl bg-ink px-4 py-3 text-right text-nav-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-[1.25rem] truncate text-xs text-nav-muted",
						children: expr || " "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl tabular-nums tracking-tight",
						children: err || out
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						"C",
						"⌫",
						"%",
						"÷",
						"7",
						"8",
						"9",
						"×",
						"4",
						"5",
						"6",
						"−",
						"1",
						"2",
						"3",
						"+",
						"0",
						".",
						"(",
						"="
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: k === "=" ? "primary" : "secondary",
						className: cn("h-11", k === "0" && "col-span-1"),
						onClick: () => press(k === "−" ? "-" : k === "×" ? "*" : k === "÷" ? "/" : k),
						children: k
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 flex items-center gap-1.5 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-3.5" }), "Safe math — no eval(). Brackets and percents allowed."]
				})
			]
		})
	});
}
function ProductDialog({ open, sku, categories, onClose }) {
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const existing = sku ? inv.getProduct(sku) : null;
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		sku: "",
		category: "",
		price: "",
		cost: "",
		reorder: "",
		qty: "",
		expiry: ""
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setError("");
		if (existing) setForm({
			name: existing.name,
			sku: existing.sku,
			category: existing.category,
			price: String(existing.price),
			cost: String(existing.cost ?? ""),
			reorder: String(existing.reorder_level),
			qty: "",
			expiry: ""
		});
		else setForm({
			name: "",
			sku: "",
			category: "",
			price: "",
			cost: "",
			reorder: "",
			qty: "",
			expiry: ""
		});
	}, [open, existing]);
	function submit(e) {
		e.preventDefault();
		const data = {
			name: form.name,
			category: form.category,
			price: form.price,
			cost: form.cost,
			reorder_level: form.reorder
		};
		mutate((eng) => {
			if (existing) {
				const r = eng.updateProduct(existing.sku, data);
				if (!r.ok) {
					setError(r.error);
					return;
				}
				toast.success(`${r.product.name} updated.`);
				onClose();
			} else {
				if (form.qty !== "") {
					const c = eng.checkBatch(form.qty, form.expiry);
					if (!c.ok) {
						setError(c.error);
						return;
					}
				}
				const r = eng.addProduct({
					...data,
					sku: form.sku
				});
				if (!r.ok) {
					setError(r.error);
					return;
				}
				if (form.qty !== "") eng.addBatch(r.product.sku, form.qty, form.expiry);
				toast.success(`${r.product.name} added.`);
				onClose();
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: existing ? "Edit product" : "Add product",
			description: existing ? "To change stock, use the batches button on the product row." : void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Product name",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SKU",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							disabled: !!existing,
							value: form.sku,
							onChange: (e) => setForm({
								...form,
								sku: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Category",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							list: "category-options",
							placeholder: "e.g. Snacks",
							value: form.category,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "category-options",
							children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price (PHP)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							step: "0.01",
							required: true,
							value: form.price,
							onChange: (e) => setForm({
								...form,
								price: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cost (PHP)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							step: "0.01",
							value: form.cost,
							onChange: (e) => setForm({
								...form,
								cost: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reorder level",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							step: "1",
							placeholder: String(inv.defaultReorder),
							value: form.reorder,
							onChange: (e) => setForm({
								...form,
								reorder: e.target.value
							})
						})
					}),
					!existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sm:col-span-2 mt-1 border-t border-border pt-3 text-sm font-semibold",
							children: "First delivery (optional)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Quantity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								step: "1",
								value: form.qty,
								onChange: (e) => setForm({
									...form,
									qty: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Expiry date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.expiry,
								onChange: (e) => setForm({
									...form,
									expiry: e.target.value
								})
							})
						})
					] }) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "sm:col-span-2 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							type: "button",
							onClick: onClose,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: existing ? "Save changes" : "Save product"
						})] })
					})
				]
			})
		})
	});
}
function BatchDialog({ sku, onClose }) {
	useApp((s) => s.revision);
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const p = sku ? inv.getProduct(sku) : null;
	const info = sku ? inv.stockInfo(sku) : null;
	const batches = sku ? inv.batchesOf(sku) : [];
	const [qty, setQty] = (0, import_react.useState)("");
	const [expiry, setExpiry] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [removeId, setRemoveId] = (0, import_react.useState)(null);
	function receive(e) {
		e.preventDefault();
		if (!sku) return;
		mutate((eng) => {
			const r = eng.addBatch(sku, qty, expiry);
			if (!r.ok) {
				setError(r.error);
				return;
			}
			setError("");
			setQty("");
			setExpiry("");
			toast.success(`Received ${r.batch.qty} pcs.`);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!sku,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			wide: true,
			title: p ? `Batches: ${p.name}` : "Batches",
			description: p && info ? `${p.sku}. ${info.sellable} sellable, ${info.expired} expired. Oldest expiry is sold first.` : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-80 overflow-auto rounded-[10px] border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2 text-left text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Batch"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-right font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Expiry"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Received"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: batches.map((b) => {
							const days = b.expiry_date ? Dates.daysBetween(inv.today(), b.expiry_date) : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-2 font-mono text-xs",
										children: ["#", b.id]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right tabular-nums",
										children: b.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: b.expiry_date ? fmtDate(b.expiry_date) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "None"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: fmtDate(b.received_date)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: days == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "neutral",
											children: "No expiry"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: days < 0 ? "bad" : days <= inv.settings.expiryWarningDays ? "warn" : "neutral",
											children: dayLabel(days)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon-sm",
											"aria-label": `Remove batch ${b.id}`,
											onClick: () => setRemoveId(b.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									})
								]
							}, b.id);
						}) })]
					}), batches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No stock on hand",
						body: "Receive a delivery below."
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: receive,
					className: "mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Quantity received",
							className: "min-w-[140px] flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								step: 1,
								required: true,
								value: qty,
								onChange: (e) => setQty(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Expiry date",
							className: "min-w-[160px] flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: expiry,
								onChange: (e) => setExpiry(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Receive stock"
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: removeId != null,
					onOpenChange: (o) => !o && setRemoveId(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						title: "Remove this batch?",
						description: "Use this for spoiled, damaged or mistaken entries.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setRemoveId(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								if (sku == null || removeId == null) return;
								mutate((e) => e.removeBatch(sku, removeId));
								setRemoveId(null);
							},
							children: "Remove batch"
						})] })
					})
				})
			]
		})
	});
}
var STATUS = {
	ok: ["ok", "In stock"],
	low: ["warn", "Low stock"],
	out: ["bad", "Out of stock"]
};
function InventoryView() {
	useApp((s) => s.revision);
	const filters = useApp((s) => s.filters);
	const setFilters = useApp((s) => s.setFilters);
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const report = inv.expiryReport(inv.settings.expiryWarningDays);
	const summary = inv.summary(report);
	const rows = inv.listProducts(filters);
	const cats = inv.categories();
	const reorder = inv.reorderList();
	const [productOpen, setProductOpen] = (0, import_react.useState)(false);
	const [editSku, setEditSku] = (0, import_react.useState)(null);
	const [batchSku, setBatchSku] = (0, import_react.useState)(null);
	const [confirmSku, setConfirmSku] = (0, import_react.useState)(null);
	function printReorder() {
		document.body.dataset.print = "reorder";
		window.print();
		const done = () => {
			delete document.body.dataset.print;
			window.removeEventListener("afterprint", done);
		};
		window.addEventListener("afterprint", done);
		setTimeout(done, 1e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Products",
						value: summary.products,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }),
						note: `${summary.out} out of sellable stock`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Needs reorder",
						value: summary.low + summary.out,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
						tone: "amber",
						note: `${summary.low} low, ${summary.out} out`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Expired batches",
						value: summary.expiredBatches,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
						tone: "red",
						note: summary.expiredBatches ? `About ${peso(summary.expiredValue)} at selling price` : "Nothing to pull out",
						emphasis: summary.expiredBatches > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sellable stock value",
						value: peso(summary.inventoryValue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "size-4" }),
						tone: "green",
						note: "At selling price, expired excluded"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Products",
					subtitle: "Sellable stock leaves out expired units.",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setEditSku(null);
							setProductOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add product"]
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2.5 border-y border-border bg-surface-2 px-5 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "search",
								placeholder: "Search products",
								"aria-label": "Search products",
								className: "min-w-[180px] flex-[2]",
								value: filters.q,
								onChange: (e) => setFilters({ q: e.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Filter by category",
								className: "h-10 min-w-[140px] flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm",
								value: filters.category,
								onChange: (e) => setFilters({ category: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All categories"
								}), cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Filter by stock status",
								className: "h-10 min-w-[140px] flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm",
								value: filters.status,
								onChange: (e) => setFilters({ status: e.target.value }),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All stock levels"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ok",
										children: "In stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "low",
										children: "Low stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "out",
										children: "Out of stock"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border bg-surface-2 text-left text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-2.5 font-medium",
										children: "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-medium",
										children: "SKU"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-medium",
										children: "Sellable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-medium",
										children: "Next expiry"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-medium",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-medium",
										children: "Price"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: "Actions"
										})
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(({ product: p, info }) => {
								const [tone, label] = STATUS[info.status];
								const statusLabel = info.status === "out" && info.expired > 0 ? "Expired only" : label;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border hover:bg-accent-soft/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted",
												children: p.category
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 font-mono text-xs whitespace-nowrap",
											children: p.sku
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-3 text-right tabular-nums",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: info.sellable }), info.expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs font-semibold text-danger",
												children: [
													"+",
													info.expired,
													" expired"
												]
											}) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: info.nextExpiry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "whitespace-nowrap",
												children: fmtDate(info.nextExpiry)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													tone: Dates.daysBetween(inv.today(), info.nextExpiry) <= inv.settings.expiryWarningDays ? "warn" : "neutral",
													children: dayLabel(Dates.daysBetween(inv.today(), info.nextExpiry))
												})
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted",
												children: "No expiry"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone,
												children: statusLabel
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-right tabular-nums",
											children: peso(p.price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3 text-right whitespace-nowrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon-sm",
													"aria-label": `Batches of ${p.name}`,
													onClick: () => setBatchSku(p.sku),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon-sm",
													"aria-label": `Edit ${p.name}`,
													onClick: () => {
														setEditSku(p.sku);
														setProductOpen(true);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon-sm",
													"aria-label": `Delete ${p.name}`,
													onClick: () => setConfirmSku(p.sku),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
												})
											]
										})
									]
								}, p.sku);
							}) })]
						}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "No products match",
							body: "Clear the search or filters, or add a new product."
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Expiring soon",
							subtitle: `Expired, or within ${inv.settings.expiryWarningDays} days.`,
							tone: "watch",
							children: report.expired.concat(report.soon).slice(0, 5).length ? report.expired.concat(report.soon).slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 border-t border-border px-5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-sm",
									children: r.product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
									className: "text-muted",
									children: [
										r.batch.qty,
										" pcs, ",
										fmtDate(r.batch.expiry_date)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: r.daysLeft < 0 ? "bad" : "warn",
									children: dayLabel(r.daysLeft)
								})]
							}, r.batch.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-5 pb-4 text-sm text-muted",
								children: "Nothing is close to expiring."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Reorder list",
							subtitle: "Low or out of sellable stock.",
							actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								onClick: printReorder,
								disabled: reorder.length === 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Print"]
							}),
							children: reorder.length ? reorder.slice(0, 8).map(({ product: p, info }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 border-t border-border px-5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-sm",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
									className: "text-muted",
									children: [
										info.sellable,
										" sellable, reorder at ",
										p.reorder_level
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: info.status === "out" ? "bad" : "warn",
									children: info.status === "out" ? "Out" : "Low"
								})]
							}, p.sku)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-5 pb-4 text-sm text-muted",
								children: "Every product is above its reorder level."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Recent activity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2.5 px-5 pb-4 text-sm text-muted",
								children: inv.activity.length ? inv.activity.slice(0, 6).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.message }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										className: "shrink-0 text-xs",
										children: fmtClock(a.time)
									})]
								}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No changes yet." })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "reorder-print",
				className: "hidden print:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: inv.settings.storeName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Reorder list · ", fmtDate(inv.today())] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "mt-4 w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b py-1 text-left",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b py-1 text-left",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b py-1 text-right",
								children: "Sellable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b py-1 text-right",
								children: "Reorder at"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b py-1",
								children: "Status"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reorder.map(({ product: p, info }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1",
								children: p.sku
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 text-right",
								children: info.sellable
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 text-right",
								children: p.reorder_level
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1",
								children: info.status === "out" ? "Out of stock" : "Low stock"
							})
						] }, p.sku)) })]
					}),
					reorder.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nothing to reorder." }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
				open: productOpen,
				sku: editSku,
				categories: cats,
				onClose: () => setProductOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchDialog, {
				sku: batchSku,
				onClose: () => setBatchSku(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!confirmSku,
				onOpenChange: (o) => !o && setConfirmSku(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Delete product",
					description: "This removes the product and all of its batches. It cannot be undone.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setConfirmSku(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							if (!confirmSku) return;
							const name = inv.getProduct(confirmSku)?.name;
							mutate((e) => e.removeProduct(confirmSku));
							toast.success(`${name} deleted.`);
							setConfirmSku(null);
						},
						children: "Delete product"
					})] })
				})
			})
		]
	});
}
function buildNotifications(inv) {
	const s = inv.settings;
	if (!s.notificationsEnabled) return [];
	const out = [];
	const dismissed = new Set(s.dismissedIds || []);
	if (s.notifyExpiry) {
		const rep = inv.expiryReport(s.expiryWarningDays);
		for (const r of [...rep.expired, ...rep.soon]) {
			const id = `expiry:${r.batch.id}`;
			if (dismissed.has(id)) continue;
			out.push({
				id,
				type: "expiry",
				title: r.daysLeft < 0 ? "Expired stock" : "Near expiration",
				body: `${r.product.name} — ${r.batch.qty} pcs, ${dayLabel(r.daysLeft).toLowerCase()}`,
				severity: r.daysLeft < 0 ? "bad" : "warn",
				view: "expiry"
			});
		}
	}
	if (s.notifyLowStock) for (const row of inv.reorderList()) {
		const id = `stock:${row.product.sku}:${row.info.sellable}`;
		if (dismissed.has(id)) continue;
		out.push({
			id,
			type: "low_stock",
			title: row.info.status === "out" ? "Out of stock" : "Low stock",
			body: `${row.product.name} — ${row.info.sellable} sellable (reorder at ${row.product.reorder_level})`,
			severity: row.info.status === "out" ? "bad" : "warn",
			view: "inventory"
		});
	}
	if (s.notifyDebts) {
		const today = inv.today();
		for (const d of inv.openDebts()) {
			if (d.dueDate > today) continue;
			const id = `debt:${d.id}:${d.dueDate}`;
			if (dismissed.has(id)) continue;
			const overdue = d.dueDate < today;
			out.push({
				id,
				type: "debt",
				title: overdue ? "Overdue utang" : "Utang due today",
				body: `${d.customerName} — ${peso(d.remaining)} due ${d.dueDate}`,
				severity: "bad",
				view: "utang"
			});
		}
	}
	const rank = {
		bad: 0,
		warn: 1,
		info: 2
	};
	return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
function notificationCounts(list) {
	return {
		total: list.length,
		expiry: list.filter((n) => n.type === "expiry").length,
		low_stock: list.filter((n) => n.type === "low_stock").length,
		debt: list.filter((n) => n.type === "debt").length
	};
}
var ICONS = {
	expiry: Clock,
	low_stock: PackageMinus,
	debt: Wallet
};
function NotificationBar() {
	useApp((s) => s.revision);
	const notifyOpen = useApp((s) => s.notifyOpen);
	const setView = useApp((s) => s.setView);
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	if (!notifyOpen || !inv.settings.notificationsEnabled) return null;
	const notes = buildNotifications(inv);
	const counts = notificationCounts(notes);
	if (notes.length === 0) return null;
	function dismiss(id) {
		mutate((eng) => {
			const ids = new Set(eng.settings.dismissedIds || []);
			ids.add(id);
			eng.settings.dismissedIds = [...ids];
		});
	}
	function dismissAll() {
		mutate((eng) => {
			const ids = new Set(eng.settings.dismissedIds || []);
			for (const n of notes) ids.add(n.id);
			eng.settings.dismissedIds = [...ids];
		});
	}
	const shown = notes.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-5 overflow-hidden rounded-xl border border-warn/40 bg-warn-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-warn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-warn",
						children: [
							counts.total,
							" notification",
							counts.total === 1 ? "" : "s"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-warn/80",
						children: [
							counts.expiry ? `${counts.expiry} near expiry` : null,
							counts.expiry && (counts.low_stock || counts.debt) ? " · " : null,
							counts.low_stock ? `${counts.low_stock} low stock` : null,
							counts.low_stock && counts.debt ? " · " : null,
							counts.debt ? `${counts.debt} overdue utang` : null
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: dismissAll,
						children: "Clear all"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Hide notifications",
						onClick: () => useApp.getState().setNotifyOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-warn/20 border-t border-warn/20",
				children: shown.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeRow, {
					n,
					onOpen: () => setView(n.view),
					onDismiss: () => dismiss(n.id)
				}, n.id))
			}),
			notes.length > shown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 py-2 text-xs text-warn/80",
				children: [
					"Showing ",
					shown.length,
					" of ",
					notes.length,
					". Open Expiry, Inventory, or Utang for the rest."
				]
			}) : null
		]
	});
}
function NoticeRow({ n, onOpen, onDismiss }) {
	const Icon = ICONS[n.type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start gap-3 px-4 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-4 shrink-0 text-warn" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onOpen,
				className: "min-w-0 flex-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-fg",
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: n.severity === "bad" ? "bad" : "warn",
						children: n.type === "debt" ? "Utang" : n.type === "low_stock" ? "Stock" : "Expiry"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: n.body
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Dismiss",
				onClick: onDismiss,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
			})
		]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-surface-3 transition-colors", "data-[state=checked]:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-5 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-accent-foreground" })
	});
}
function SettingsView() {
	useApp((s) => s.revision);
	const updateSettings = useApp((s) => s.updateSettings);
	const resetSample = useApp((s) => s.resetSample);
	const importData = useApp((s) => s.importData);
	const inv = getEngine();
	const s = inv.settings;
	const fileRef = (0, import_react.useRef)(null);
	function exportJSON() {
		const blob = new Blob([JSON.stringify(inv.toJSON(), null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `tindahan-${Dates.todayStr()}.json`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid max-w-3xl gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Store",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 px-5 pb-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Store name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.storeName,
							onChange: (e) => updateSettings({ storeName: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slip footer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.slipFooter,
							onChange: (e) => updateSettings({ slipFooter: e.target.value })
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Notifications",
				subtitle: "The bell in the header turns the bar on or off. Fine-tune what it watches here.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 px-5 pb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Show notification bar",
							hint: "Master switch, same as the bell.",
							checked: s.notificationsEnabled,
							onChange: (v) => {
								useApp.getState().setNotifyOpen(v);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Near expiration",
							hint: `Batches that expire within ${s.expiryWarningDays} days, plus already expired stock.`,
							checked: s.notifyExpiry,
							onChange: (v) => updateSettings({ notifyExpiry: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Warn this many days before expiry",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 365,
								value: s.expiryWarningDays,
								onChange: (e) => {
									let d = parseInt(e.target.value, 10);
									if (!Number.isInteger(d) || d < 1) d = 1;
									if (d > 365) d = 365;
									updateSettings({ expiryWarningDays: d });
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Low stock",
							hint: "Fires when sellable quantity hits the product’s reorder level.",
							checked: s.notifyLowStock,
							onChange: (v) => updateSettings({ notifyLowStock: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Utang / debts",
							hint: "When a debt deadline is today or already past, and it is still unpaid.",
							checked: s.notifyDebts,
							onChange: (v) => updateSettings({ notifyDebts: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "w-fit",
							onClick: () => {
								updateSettings({ dismissedIds: [] });
								toast.success("Dismissed notices will show again.");
							},
							children: "Restore dismissed notices"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Utang defaults",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pb-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default due in (days)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 365,
							value: s.defaultDebtDays,
							onChange: (e) => updateSettings({ defaultDebtDays: Math.max(0, Number(e.target.value) || 0) })
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Data",
				subtitle: "Everything is saved in this browser. Export a JSON backup before you reset.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 px-5 pb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: exportJSON,
							children: "Export JSON"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: "Import JSON"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								if (!confirm("Replace everything with the sample store? Current products, sales and utang will be lost.")) return;
								resetSample();
								toast.success("Sample data loaded.");
							},
							children: "Reset sample data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json,.json",
							hidden: true,
							onChange: async (e) => {
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
							}
						})
					]
				})
			})
		]
	});
}
function Toggle({ label, hint, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
var NAV = [
	{
		view: "inventory",
		label: "Inventory",
		icon: Layers
	},
	{
		view: "billing",
		label: "Billing",
		icon: ShoppingCart
	},
	{
		view: "expiry",
		label: "Expiry watch",
		icon: Clock
	},
	{
		view: "utang",
		label: "Utang",
		icon: Wallet
	},
	{
		view: "finance",
		label: "Finance",
		icon: Package
	},
	{
		view: "settings",
		label: "Settings",
		icon: Settings
	}
];
var TITLES = {
	inventory: "Inventory",
	billing: "Billing",
	expiry: "Expiry watch",
	utang: "Utang / Debts",
	finance: "Finance",
	settings: "Settings"
};
function Shell({ children }) {
	const view = useApp((s) => s.view);
	const setView = useApp((s) => s.setView);
	useApp((s) => s.revision);
	const notifyOpen = useApp((s) => s.notifyOpen);
	const setNotifyOpen = useApp((s) => s.setNotifyOpen);
	const updateSettings = useApp((s) => s.updateSettings);
	const [open, setOpen] = (0, import_react.useState)(false);
	const inv = getEngine();
	const notes = buildNotifications(inv);
	const expiryCount = inv.expiryReport(inv.settings.expiryWarningDays);
	const expiryBadge = expiryCount.expired.length + expiryCount.soon.length;
	const theme = inv.settings.theme || "light";
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString(inv.settings.locale, {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
	function go(v) {
		setView(v);
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh",
		children: [
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "fixed inset-0 z-30 bg-ink/50 md:hidden",
				"aria-label": "Close navigation",
				onClick: () => setOpen(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col gap-1.5 overflow-y-auto bg-nav p-3.5 text-nav-ink md:sticky md:top-0 md:h-dvh md:translate-x-0", open ? "translate-x-0" : "-translate-x-full md:translate-x-0"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3 px-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-[10px] bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-display text-[1.05rem] font-semibold text-white",
								children: inv.settings.storeName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-nav-muted",
								children: "Tindahan ledger"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "grid gap-1",
						children: NAV.map((item) => {
							const Icon = item.icon;
							const active = view === item.view;
							const badge = item.view === "expiry" ? expiryBadge : item.view === "utang" ? inv.financeSummary().overdueDebts : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => go(item.view),
								className: cn("flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-nav-ink transition-colors", active ? "bg-white/15 text-white" : "hover:bg-white/10"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: item.label
									}),
									badge > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-[22px] rounded-full bg-warn px-1.5 text-center text-[11px] font-bold text-ink",
										children: badge
									}) : null
								]
							}, item.view);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-auto px-3 pt-4 text-xs text-nav-muted",
						children: "FEFO billing · expiry watch · utang · finance. Data stays in this browser."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 md:px-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							className: "md:hidden",
							"aria-label": "Open navigation",
							onClick: () => setOpen(true),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-semibold tracking-tight md:text-2xl",
							children: TITLES[view]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted sm:inline",
								children: today
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: notifyOpen ? "secondary" : "ghost",
								size: "icon",
								"aria-label": notifyOpen ? "Turn notifications off" : "Turn notifications on",
								title: "Toggle notifications",
								onClick: () => setNotifyOpen(!notifyOpen),
								className: "relative",
								children: [notifyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "size-4" }), notifyOpen && notes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "icon",
								"aria-label": theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
								onClick: () => updateSettings({ theme: theme === "dark" ? "light" : "dark" }),
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 pb-12 md:px-7",
					children
				})]
			})
		]
	});
}
function UtangView() {
	useApp((s) => s.revision);
	const mutate = useApp((s) => s.mutate);
	const inv = getEngine();
	const open = inv.openDebts();
	const today = inv.today();
	const overdue = open.filter((d) => d.dueDate <= today);
	const fin = inv.financeSummary();
	const [pay, setPay] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open utang",
						value: open.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }),
						note: `${peso(fin.utangAssets)} still collectible`,
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue",
						value: overdue.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }),
						tone: "red",
						note: "Deadline reached, still unpaid",
						emphasis: overdue.length > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Customers",
						value: inv.customers.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }),
						note: "People with a store account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Open debts",
				subtitle: "Utang from sales that have not been fully paid. Overdue rows need a collection or a return.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-y border-border bg-surface-2 text-left text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 font-medium",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Sale"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 text-right font-medium",
									children: "Original"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 text-right font-medium",
									children: "Remaining"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Due"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-2.5" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: open.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: d.customerName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: inv.getCustomer(d.customerId)?.phone || "No phone"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3",
									children: ["#", d.saleId]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-right tabular-nums",
									children: peso(d.amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-right font-semibold tabular-nums",
									children: peso(d.remaining)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: fmtDate(d.dueDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: d.status === "overdue" ? "bad" : "warn",
										children: d.status === "overdue" ? "Overdue" : "Open"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => {
											setPay(d);
											setAmount(String(d.remaining));
										},
										children: "Collect"
									})
								})
							]
						}, d.id)) })]
					}), open.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No open utang",
						body: "Sales paid in cash, or fully collected debts, will not appear here."
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Customers",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " Add customer"]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-y border-border bg-surface-2 text-left text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 font-medium",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Phone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-2.5 text-right font-medium",
									children: "Balance"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: inv.customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 font-semibold",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-muted",
									children: c.phone || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right tabular-nums",
									children: peso(inv.customerBalance(c.id))
								})
							]
						}, c.id)) })]
					}), inv.customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No customers yet",
						body: "Add someone here, or create them when recording an utang sale."
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!pay,
				onOpenChange: (o) => !o && setPay(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: pay ? `Collect from ${pay.customerName}` : "Collect",
					description: pay ? `Remaining ${peso(pay.remaining)}. Partial payments are allowed.` : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount (PHP)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: .01,
							step: "0.01",
							value: amount,
							onChange: (e) => setAmount(e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setPay(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (!pay) return;
							mutate((eng) => {
								const r = eng.payDebt(pay.id, amount);
								if (!r.ok) {
									toast.error(r.error);
									return;
								}
								toast.success(`Collected ${peso(r.paid)}.`);
								setPay(null);
							});
						},
						children: "Record payment"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Add customer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value)
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setAddOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							mutate((eng) => {
								const r = eng.addCustomer({
									name,
									phone
								});
								if (!r.ok) {
									toast.error(r.error);
									return;
								}
								toast.success(`${r.customer.name} saved.`);
								setName("");
								setPhone("");
								setAddOpen(false);
							});
						},
						children: "Save customer"
					})] })]
				})
			})
		]
	});
}
function Home() {
	const ready = useApp((s) => s.ready);
	const view = useApp((s) => s.view);
	const hydrate = useApp((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Opening the ledger…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBar, {}),
		view === "inventory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryView, {}) : null,
		view === "billing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingView, {}) : null,
		view === "expiry" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpiryView, {}) : null,
		view === "utang" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtangView, {}) : null,
		view === "finance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceView, {}) : null,
		view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {}) : null
	] });
}
//#endregion
export { Home as component };
