import { Dates } from "./dates";
import type { Inventory } from "./inventory";

type SeedProduct = {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  reorder_level: number;
  batches: Array<{ qty: number; expiry_in_days?: number }>;
};

function c(price: number) {
  return Math.round(price * 0.72 * 100) / 100;
}

export const SEED_PRODUCTS: SeedProduct[] = [
  { sku: "RICE-001", name: "Sinandomeng rice (per kg)", category: "Rice", price: 56, cost: c(56), reorder_level: 20, batches: [{ qty: 40, expiry_in_days: 150 }] },
  { sku: "RICE-002", name: "Jasmine rice (per kg)", category: "Rice", price: 62, cost: c(62), reorder_level: 15, batches: [{ qty: 12, expiry_in_days: 140 }] },
  { sku: "CAN-001", name: "Corned beef 150g", category: "Canned goods", price: 38, cost: c(38), reorder_level: 10, batches: [{ qty: 6, expiry_in_days: -3 }, { qty: 10, expiry_in_days: 300 }] },
  { sku: "CAN-002", name: "Sardines in tomato sauce 155g", category: "Canned goods", price: 24, cost: c(24), reorder_level: 10, batches: [{ qty: 24, expiry_in_days: 260 }] },
  { sku: "CAN-003", name: "Tuna flakes 155g", category: "Canned goods", price: 36, cost: c(36), reorder_level: 8, batches: [{ qty: 9, expiry_in_days: 6 }, { qty: 12, expiry_in_days: 400 }] },
  { sku: "CAN-004", name: "Sardines green 155g", category: "Canned goods", price: 22, cost: c(22), reorder_level: 10, batches: [{ qty: 18, expiry_in_days: 240 }] },
  { sku: "NOO-001", name: "Instant pancit canton 60g", category: "Noodles", price: 16, cost: c(16), reorder_level: 20, batches: [{ qty: 30, expiry_in_days: 170 }, { qty: 15, expiry_in_days: 60 }] },
  { sku: "NOO-002", name: "Instant mami beef 55g", category: "Noodles", price: 14, cost: c(14), reorder_level: 15, batches: [{ qty: 8, expiry_in_days: -10 }] },
  { sku: "SNK-001", name: "Cheese potato chips 40g", category: "Snacks", price: 20, cost: c(20), reorder_level: 10, batches: [{ qty: 18, expiry_in_days: 75 }] },
  { sku: "SNK-002", name: "BBQ corn chips 27g", category: "Snacks", price: 10, cost: c(10), reorder_level: 12, batches: [{ qty: 5, expiry_in_days: 11 }] },
  { sku: "SNK-003", name: "Cheddar corn snack 40g", category: "Snacks", price: 18, cost: c(18), reorder_level: 10, batches: [{ qty: 14, expiry_in_days: 9 }, { qty: 20, expiry_in_days: 80 }] },
  { sku: "SNK-004", name: "Plain crackers 10s", category: "Snacks", price: 62, cost: c(62), reorder_level: 5, batches: [{ qty: 10, expiry_in_days: 120 }] },
  { sku: "BEV-001", name: "Cola 1.5L", category: "Beverages", price: 75, cost: c(75), reorder_level: 6, batches: [{ qty: 18, expiry_in_days: 130 }] },
  { sku: "BEV-002", name: "Orange soda 500ml", category: "Beverages", price: 25, cost: c(25), reorder_level: 8, batches: [] },
  { sku: "BEV-003", name: "Orange juice drink 200ml", category: "Beverages", price: 12, cost: c(12), reorder_level: 10, batches: [{ qty: 40, expiry_in_days: 200 }] },
  { sku: "ALC-001", name: "Beer 500ml bottle", category: "Alcohol", price: 55, cost: c(55), reorder_level: 12, batches: [{ qty: 36 }] },
  { sku: "ALC-002", name: "Beer 330ml can", category: "Alcohol", price: 45, cost: c(45), reorder_level: 12, batches: [{ qty: 24 }] },
  { sku: "ALC-003", name: "Rhum 350ml", category: "Alcohol", price: 95, cost: c(95), reorder_level: 6, batches: [{ qty: 10 }] },
  { sku: "CIG-001", name: "Cigarettes red pack", category: "Cigarettes", price: 145, cost: c(145), reorder_level: 5, batches: [{ qty: 20 }] },
  { sku: "CIG-002", name: "Cigarettes menthol pack", category: "Cigarettes", price: 140, cost: c(140), reorder_level: 5, batches: [{ qty: 4 }] },
  { sku: "CON-001", name: "Cane vinegar 385ml", category: "Condiments", price: 20, cost: c(20), reorder_level: 8, batches: [{ qty: 20, expiry_in_days: 500 }] },
  { sku: "CON-002", name: "Soy sauce 385ml", category: "Condiments", price: 22, cost: c(22), reorder_level: 8, batches: [{ qty: 16, expiry_in_days: 480 }] },
  { sku: "COF-001", name: "Brown coffee sachet", category: "Coffee and milk", price: 8, cost: c(8), reorder_level: 30, batches: [{ qty: 60, expiry_in_days: 220 }] },
  { sku: "COF-002", name: "Powdered milk 33g", category: "Coffee and milk", price: 15, cost: c(15), reorder_level: 15, batches: [{ qty: 20, expiry_in_days: 3 }, { qty: 25, expiry_in_days: 190 }] },
  { sku: "HOU-001", name: "Detergent powder sachet", category: "Household", price: 9, cost: c(9), reorder_level: 20, batches: [{ qty: 50 }] },
  { sku: "HOU-002", name: "Bath soap bar", category: "Household", price: 28, cost: c(28), reorder_level: 8, batches: [{ qty: 10 }] },
];

export function loadSample(inv: Inventory) {
  inv.importSeed({ products: SEED_PRODUCTS });
  seedDemoLedger(inv);
}

export function seedDemoLedger(inv: Inventory) {
  const today = inv.today();
  inv.addCustomer({ name: "Aling Rosa", phone: "0917 555 0101" });
  inv.addCustomer({ name: "Mang Ben", phone: "0918 555 0144" });
  inv.addCustomer({ name: "Jenny Cruz", phone: "0920 555 0199" });

  inv.sell(
    [
      { sku: "SNK-001", qty: 2 },
      { sku: "BEV-001", qty: 1 },
    ],
    { payment: "cash" },
  );
  inv.sell(
    [
      { sku: "CAN-002", qty: 4 },
      { sku: "RICE-001", qty: 5 },
    ],
    {
      payment: "utang",
      customerName: "Aling Rosa",
      dueDate: Dates.addDays(today, -2),
    },
  );
  inv.sell([{ sku: "ALC-001", qty: 2 }], {
    payment: "utang",
    customerName: "Mang Ben",
    dueDate: Dates.addDays(today, 10),
  });
  inv.sell(
    [
      { sku: "COF-001", qty: 10 },
      { sku: "HOU-001", qty: 6 },
    ],
    { payment: "cash" },
  );
  const ben = inv.debts.find((d) => d.customerName === "Mang Ben");
  if (ben) inv.payDebt(ben.id, 40);

  inv.activity = [];
  inv.log("Sample store loaded — including a few sales and utang.");
}
