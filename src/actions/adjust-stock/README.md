# adjustStock

Records a stock movement for one variant at one outlet: an audited, atomic two-write (spec §3.3.3) — the inventory row's `quantity` and an append-only `stock-changes` history row are written together, or neither is written.

> **Render-side command.** Handled by kaching's command-frame handler. This is the **only** way inventory `quantity` changes after creation — there is no direct inventory-update command.

## Parameters

### `AdjustStockParams`

```typescript
interface AdjustStockParams {
  productId: string;
  variantId: string;
  outletId: string;
  specificAction:
    | 'STOCK_RECEIVED'
    | 'INVENTORY_RECOUNT'
    | 'DAMAGE'
    | 'THEFT'
    | 'LOSS'
    | 'RESTOCK_RETURN'
    | 'REFUND_RESTOCK_RETURN'
    | 'REFUND_DAMAGE'
    | 'SALE'
    | 'TRANSFER'
    | 'BULK_RECOUNT';
  baseAction?: 'ADD' | 'REMOVE' | 'RECOUNT' | 'SKIP';
  quantity: number;
  userId?: string;
}
```

| Param            | Type     | Required | Notes                                                                                                                                                                                                                                                                      |
| ---------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`      | `string` | yes      | The product owning the variant.                                                                                                                                                                                                                                            |
| `variantId`      | `string` | yes      | The variant whose inventory row is adjusted.                                                                                                                                                                                                                               |
| `outletId`       | `string` | yes      | The outlet whose inventory row is adjusted.                                                                                                                                                                                                                                |
| `specificAction` | see enum | yes      | The finer-grained reason. The UI exposes 6 of these (see below); the rest are system-emitted but must be accepted.                                                                                                                                                         |
| `baseAction`     | see enum | no       | The coarse bucket. Omit it and it's derived from `specificAction` via the table below. If you pass it explicitly and it doesn't match the derived value, the call **throws**.                                                                                              |
| `quantity`       | `number` | yes      | Integer. **Signed** for `ADD`/`REMOVE` (a `REMOVE` movement arrives as a **negative** number — don't pass a positive number expecting the command to negate it); **absolute** for `RECOUNT` (the new on-hand total, not a delta). Ignored (but still required) for `SKIP`. |
| `userId`         | `string` | no       | Attributed on the stock-changes history row.                                                                                                                                                                                                                               |

### §6.5 mapping table (`specificAction` → `baseAction`)

| `specificAction`                                            | `baseAction` |
| ----------------------------------------------------------- | ------------ |
| `STOCK_RECEIVED`, `RESTOCK_RETURN`, `REFUND_RESTOCK_RETURN` | `ADD`        |
| `DAMAGE`, `THEFT`, `LOSS`, `SALE`, `TRANSFER`               | `REMOVE`     |
| `REFUND_DAMAGE`                                             | `SKIP`       |
| `INVENTORY_RECOUNT`, `BULK_RECOUNT`                         | `RECOUNT`    |

`SALE` and `TRANSFER` are system-emitted (checkout / transfer flows) rather than operator-triggered from a stock-adjustment UI, but must still resolve through this same table. A third-party-sync-only reason (`APPLIED_FROM_WOO`, also `RECOUNT`) exists server-side but isn't part of this client-facing enum.

### Signed-quantity semantics

- **`ADD` / `REMOVE`** — the inventory row's `quantity` is **incremented** by `quantity` as given. That means a `REMOVE` movement (e.g. `DAMAGE`, `THEFT`) must be passed as a negative number (`quantity: -3`, not `quantity: 3`) — the command does not flip the sign for you.
- **`RECOUNT`** — `quantity` **replaces** the row's on-hand total outright (an absolute count from a physical recount), not a delta.
- **`SKIP`** — no quantity change; only the audit row is meant to be informative (parity: `REFUND_DAMAGE` records that a refunded item was damaged and does **not** go back into sellable stock).

Guard (kaching-side, not visible in the mock): the inventory row must already exist with `manageStock: true` — otherwise the call is a no-op (returns the current, unchanged quantity rather than writing anything).

## Response

### `AdjustStockResponse`

```typescript
interface AdjustStockResponse {
  success: boolean;
  updatedQuantity: number;
  stockChangeId: string;
  timestamp: string;
}
```

`updatedQuantity` is the post-write on-hand level. `stockChangeId` is the id of the newly-appended `stock-changes` history row — pass it to `getStockHistory` to look the movement back up.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Received a shipment of 20 units — baseAction derived as ADD
await command.adjustStock({
  productId: '64abc123def456',
  variantId: 'variant_001',
  outletId: 'outlet_main',
  specificAction: 'STOCK_RECEIVED',
  quantity: 20,
});

// Recorded 3 units damaged — REMOVE, so quantity is negative
await command.adjustStock({
  productId: '64abc123def456',
  variantId: 'variant_001',
  outletId: 'outlet_main',
  specificAction: 'DAMAGE',
  quantity: -3,
  userId: 'user_mario',
});

// Physical recount landed on 42 units on-hand — RECOUNT, quantity is absolute
const result = await command.adjustStock({
  productId: '64abc123def456',
  variantId: 'variant_001',
  outletId: 'outlet_main',
  specificAction: 'INVENTORY_RECOUNT',
  quantity: 42,
});
console.log(result.updatedQuantity); // 42
```
