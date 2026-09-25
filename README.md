# Store Inventory: expiry-aware stock and billing

A small-grocery system built around one idea: **the batch that expires first is always the one you see first and the one you sell first (FEFO)**. It grew out of an interview with a mini-grocery owner whose hardest problem was products expiring unnoticed, plus manual billing with no itemized slip.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure: three views (Inventory, Billing, Expiry watch) and the dialogs |
| `css/styles.css` | Look and feel, light/dark theme, mobile layout, print rules for the slip |
| `js/structures.js` | **The MinHeap** (priority queue). No other code in the file |
| `js/inventory.js` | **All the rules**: product Map, per-SKU heaps, FEFO selling, expiry report, save/load. No screen code |
| `js/app.js` | Screen code only: reads input, calls `Inventory`, draws results |
| `js/tests.js`, `js/run-tests.js`, `tests.html` | Unit tests and benchmarks |
| `data/products.json` | Sample products and batches (`expiry_in_days` counts from load day, so the demo never goes stale) |
| `data/config.json` | Store name, currency, warning window, default reorder level, slip footer |

## Data structures

- **Hash table** `Map<SKU, product>`: find a product in O(1); a SKU cannot be added twice.
- **Min-heap per SKU** `Map<SKU, MinHeap<batch>>`, keyed by expiry date (ties broken by batch id): the earliest-expiring batch is always at the top.
- **One temporary heap of all dated batches** is built (O(n)) whenever the expiry report is drawn.

## Running time (p = products, b = batches of one SKU, n = all batches)

| Operation | How | Time |
|---|---|---|
| Find a product by SKU | Map lookup | O(1) average |
| Add product | Map insert | O(1) average |
| Receive a delivery (add batch) | heap push (sift-up) | O(log b) |
| Sell q units, first-expired first | peek / pop on the SKU's heap | O((k + e) log b), k batches used, e expired batches skipped |
| Expiry report (m batches in the window) | heapify all + m pops | O(n + m log n) |
| Pull out all expired | pop while the top is expired | O(e log b) per SKU |
| Remove one batch | filter + heapify | O(b) |
| Search / filter table | linear scan | O(p · text length) |
| Space | Map + heaps | O(p + n) |

## Rules the system enforces

1. A batch is **expired** when its date is before today. It can still be sold on its expiry date.
2. **Expired stock is never sold.** It is excluded from "sellable" and must be pulled out.
3. A sale is **all-or-nothing**: if any line is short, nothing is deducted.
4. Money is added in whole centavos, so totals are exact (3 x 19.99 = 59.97).
5. Stock with no expiry date (rice may have one; cigarettes and liquor usually don't) sorts last and never appears in expiry lists.

## Where each rubric criterion shows up

| Criterion | Evidence in this project |
|---|---|
| Problem identification, analysis, formulation | The interview, plus the rules above and the operations table (write these up in your paper) |
| Data structure selection | Map + MinHeap; compare with array scan and sorted array using the benchmark table |
| Algorithm selection and application | Heap sift-up / sift-down, FEFO selling, expiry report (`structures.js`, `inventory.js`) |
| Pseudocode / flowchart | Draw them from `MinHeap.push`, `MinHeap.pop`, `Inventory.sell` and `Inventory.expiryReport` |
| Complexity analysis | Table above; confirmed by the benchmarks in `tests.html` |
| Proposed IT solution | This app: inventory, billing with a printable slip, expiry watch |
| Testing, evidence, results | `tests.html` screenshots, plus your own manual test table using the sample data |
| Presentation and defense | See the questions below |

## Questions to be ready for

- **Why a heap and not a sorted list?** A sorted list makes each insert O(n) (shifting). A heap keeps the earliest date on top with O(log n) inserts.
- **The store only has about 300 products. Why bother?** Each product can have several batches, so the record count is larger than the product count. The design also holds up if the store grows, and the benchmarks show where a scan starts to hurt.
- **Why sort by expiry and not by arrival?** Because losses come from what expires first, not from what arrived first.
- **What happens with two batches that expire the same day?** The one received first (lower id) is used first.
- **Why is removing a batch O(b)?** A heap only gives cheap access to its top. Removing from the middle rebuilds that one small heap. It is rare and b is small.

## Added features (v3)

- **Notifications / Alerts**: low stock, near-expiry, expired-on-shelf, and utang deadlines (due within 3 days or overdue). Badges on the sidebar and a dedicated Alerts view.
- **Utang**: sales can be recorded as customer credit with due date; list, pay, partial payments, overdue status.
- **Checkout payment mode**: before completing a sale, choose Cash or Utang (customer name + due date required for utang).
- **Refunds / returns**: from Recent sales, open Refund, choose quantities, restock via new batches, reduce utang balance when applicable.
- **Finance**: assets (inventory value + outstanding utang), net cash movement, expired losses, illustrative net gain, plus a safe shop calculator.
- **Print reorder list**: Print button on the Inventory reorder panel.
- **Expandable sidebar**: collapse to icon-only rail; state remembered.
- **Engaging UI**: refreshed cards, gradients, badges, smoother interactions, dark/light theme.

## Limits (say these before you are asked)

- Data lives in one browser. There is no server, login or multi-user support.
- The slip is **not an official BIR receipt**. Real receipts and invoices have registration and format rules.
- The loss estimate uses selling price because the system doesn't store cost price.
- Net gain / net worth figures are illustrative for the store owner, not formal accounting.
- The reorder level is set per product by hand. It does not learn from sales.
