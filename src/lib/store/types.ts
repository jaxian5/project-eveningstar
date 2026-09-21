export type StockStatus = "ok" | "low" | "out";
export type PaymentMethod = "cash" | "utang";
export type SaleStatus = "complete" | "partial_return" | "returned";
export type DebtStatus = "open" | "paid" | "overdue" | "cancelled";
export type AppView =
  | "inventory"
  | "billing"
  | "expiry"
  | "utang"
  | "finance"
  | "settings";
export type NotificationType = "expiry" | "low_stock" | "debt";

export type Product = {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  reorder_level: number;
};

export type Batch = {
  id: number;
  sku: string;
  qty: number;
  expiry_date: string | null;
  received_date: string;
};

export type SaleBatchTake = {
  batch_id: number;
  expiry_date: string | null;
  qty: number;
};

export type SaleLine = {
  sku: string;
  name: string;
  qty: number;
  price: number;
  cost: number;
  amount: number;
  batches: SaleBatchTake[];
};

export type SaleReturn = {
  sku: string;
  qty: number;
  amount: number;
  time: string;
};

export type Sale = {
  id: number;
  time: string;
  date: string;
  lines: SaleLine[];
  total: number;
  payment: PaymentMethod;
  customerId?: number;
  customerName?: string;
  debtId?: number;
  status: SaleStatus;
  returns: SaleReturn[];
  refundedAmount: number;
};

export type Activity = { message: string; time: string };

export type Customer = {
  id: number;
  name: string;
  phone: string;
  notes: string;
};

export type DebtPayment = {
  id: number;
  amount: number;
  time: string;
  note: string;
};

export type Debt = {
  id: number;
  customerId: number;
  customerName: string;
  saleId: number;
  amount: number;
  remaining: number;
  dueDate: string;
  createdAt: string;
  status: DebtStatus;
  payments: DebtPayment[];
};

export type PulloutItem = {
  sku: string;
  name: string;
  qty: number;
  expiry_date: string | null;
  value: number;
};

export type Pullout = {
  id: number;
  time: string;
  date: string;
  batches: number;
  qty: number;
  loss: number;
  items: PulloutItem[];
};

export type CashEvent = {
  id: number;
  type: "sale_cash" | "debt_pay" | "refund";
  amount: number;
  time: string;
  date: string;
  note: string;
  ref?: string;
};

export type Settings = {
  storeName: string;
  currency: string;
  locale: string;
  expiryWarningDays: number;
  defaultReorder: number;
  defaultDebtDays: number;
  notificationsEnabled: boolean;
  notifyExpiry: boolean;
  notifyLowStock: boolean;
  notifyDebts: boolean;
  dismissedIds: string[];
  theme: "light" | "dark";
  slipFooter: string;
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  severity: "warn" | "bad" | "info";
  view: AppView;
};

export type StockInfo = {
  total: number;
  sellable: number;
  expired: number;
  nextExpiry: string | null;
  status: StockStatus;
  batches: number;
};

export type ProductRow = { product: Product; info: StockInfo };

export type ExpiryRow = {
  batch: Batch;
  product: Product;
  daysLeft: number;
  value: number;
};

export type ExpiryReport = {
  expired: ExpiryRow[];
  soon: ExpiryRow[];
  examined: number;
};

export type Shortage = {
  sku: string;
  name: string;
  requested: number;
  available: number;
  expired: number;
};

export type Fail = { ok: false; error: string; shortages?: Shortage[] };

export type InventoryState = {
  format: "store-inventory-state";
  version: number;
  saved_at: string;
  settings: Settings;
  nextBatchId: number;
  nextSaleId: number;
  nextCustomerId: number;
  nextDebtId: number;
  nextPaymentId: number;
  nextPulloutId: number;
  nextCashId: number;
  products: Product[];
  batches: Batch[];
  sales: Sale[];
  activity: Activity[];
  customers: Customer[];
  debts: Debt[];
  pullouts: Pullout[];
  cashEvents: CashEvent[];
};

export type FinanceSummary = {
  earnedMoney: number;
  profitGain: number;
  grossSales: number;
  cogs: number;
  expiryLoss: number;
  utangAssets: number;
  inventoryRetail: number;
  inventoryCost: number;
  netWorth: number;
  cashSales: number;
  utangSales: number;
  refunds: number;
  collections: number;
  openDebts: number;
  overdueDebts: number;
};

export const DEFAULT_SETTINGS: Settings = {
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
  slipFooter: "Thank you! This is a sales slip, not an official BIR receipt.",
};

export const STORAGE_KEY = "store-inventory-v3";
