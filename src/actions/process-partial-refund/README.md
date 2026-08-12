# processPartialRefund

Processes a partial refund based on the current refund selections in the refund details state.

## Parameters

`params?: ProcessPartialRefundParams`

| Parameter | Type      | Required | Description                                                                                                                                                                                               |
| :-------- | :-------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reason`  | `string`  | `false`  | Optional reason for the refund.                                                                                                                                                                           |
| `orderId` | `string`  | `false`  | Optional order to refund (sets it active first).                                                                                                                                                          |
| `items`   | `array`   | `false`  | Optional items to select for refund before processing. A `product` entry may carry `stockAction` — see "Per-item stock actions" below.                                                                    |
| `openUI`  | `boolean` | `false`  | Multi-tender only. Defaults to `true`. See "Multi-tender orders" below.                                                                                                                                   |
| `legs`    | `array`   | `false`  | Explicit per-tender allocation (minor units); a leg may carry a `giftCard` destination for mixed returns. Requires `openUI: false`. See "Choosing which payments to refund to" and "Mixed returns" below. |

## Response

`Promise<ProcessPartialRefundResponse>`

| Field       | Type      | Description                                                 |
| :---------- | :-------- | :---------------------------------------------------------- |
| `success`   | `boolean` | `true` if the refund processing was initiated successfully. |
| `refundId`  | `string`  | The ID of the created refund (may be 'pending' initially).  |
| `timestamp` | `string`  | ISO date string of when the action occurred.                |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // First, select items to refund (e.g., using selectAllRefundItems or other refund selection methods)
  await command.selectAllRefundItems();

  // Process the partial refund
  const result = await command.processPartialRefund({
    reason: 'Customer requested return',
  });
  console.log('Refund processed:', result);
  // Expected output:
  // {
  //   success: true,
  //   refundId: 'refund-id-456',
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }
} catch (error) {
  console.error('Failed to process refund:', error);
}
```

## Error Handling

- Throws an error if no order is currently active.
- Throws an error if no refund details exist.
- Throws an error if no items are selected for refund.

```typescript
// Example of error when no items selected
try {
  await command.processPartialRefund();
} catch (error) {
  console.error(error.message); // "No items selected for refund. Please select items to refund first."
}
```

## Multi-tender orders

An order paid across more than one payment method needs the refund allocated
across the original sources. By default (`openUI` omitted or `true`) this command
raises the POS split-payment refund modal so the cashier chooses the allocation,
and returns without committing — the modal drives the commit.

Flows that render their own refund UI can opt out of that modal with
`openUI: false`. The refund is then committed **headlessly** against the
planner's default proportional allocation across the original sources (every
cash-rounding invariant preserved), with no modal shown:

```typescript
// Headless multi-tender partial refund — no split-payment modal.
await command.processPartialRefund({
  orderId: 'order-123',
  items: [{ itemKey: 'line-1', quantity: 1, type: 'product' }],
  openUI: false,
});
```

`openUI` has no effect on single-tender orders (they are already headless — there
is nothing to allocate).

## Choosing which payments to refund to

The split-payment refund modal let a cashier pick **which original payment** each
refunded dollar returns to. `legs` is the headless replacement: with
`openUI: false`, pass an explicit per-tender allocation and the refund is
committed exactly as staged — no modal.

Each leg names an original payment by its `transactionId` and the amount, **in
minor units** (cents), to return to that source:

```typescript
// Refund a 15.00 selection: 7.00 back to the cash payment, 8.00 back to the card.
await command.processPartialRefund({
  orderId: 'order-123',
  items: [{ itemKey: 'line-1', quantity: 1, type: 'product' }],
  openUI: false,
  legs: [
    { transactionId: 'cash-txn-id', amount: 700 },
    { transactionId: 'card-txn-id', amount: 800 },
  ],
});
```

Rules (each throws and commits nothing on failure):

- **`legs` requires `openUI: false`.** With the modal path (`openUI` omitted or
  `true`) the modal owns allocation and `legs` are ignored.
- **Σ `amount` must equal the allocatable refund budget** —
  `min(the refund total computed from the selected items, Σ of each source's
remaining refundable capacity)`. On a **full** selection this is the captured
  total: a cash-rounded sale captured slightly more or less than the goods math,
  so Σ of the per-source caps (captured) is what the legs must reach and the gap
  to the goods math is **auto-stamped** as cash-rounding residue on a cash leg.
  (Requiring the raw goods total would be unsatisfiable on a cash-rounded
  capture.)
- **The amounts aggregated per source must be ≤ that source's remaining
  refundable capacity** (two legs on the same source are summed before the check).
- **Zero-amount entries are ignored; negative amounts are rejected.** A `0` leg
  is dropped like an omitted row — matching the split-payment modal, which let a
  cashier put all the money on one tender and leave the other row at 0. A
  negative `amount` throws.
- **Each `transactionId` must match a payment on the order.**

Cash legs receive the same drawer-rounding and residue handling the modal
applied, so the engine's refund invariants hold. Omit `legs` (with
`openUI: false`) to fall back to the default proportional allocation across all
sources.

> **Mock divergence:** the standalone mock does **not** enforce the `legs`
> validation above (negative amounts, unknown `transactionId`s and missing
> `giftCard.referenceId` all "succeed" outside the iframe). Test the error
> paths against the real runtime.

## Mixed returns (some money back to source, some onto a gift card)

Set `giftCard` on any leg to land that leg's amount on a gift-card /
store-credit tender instead of returning it to the original payment. One `legs`
array can freely **mix** source-return legs and gift-card legs — a single refund
that splits its destinations:

```typescript
// Refund a 40.00 selection: 20.00 back to the cash tender, 20.00 of the card
// slice onto gift card GC1.
await command.processPartialRefund({
  orderId: 'order-123',
  items: [{ itemKey: 'line-1', quantity: 1, type: 'product' }],
  openUI: false,
  legs: [
    { transactionId: 'cash-txn-id', amount: 2000 },
    { transactionId: 'card-txn-id', amount: 2000, giftCard: { referenceId: 'GC1' } },
  ],
});
```

A gift-card leg still **draws from its source** for capacity and audit (its
`saleId` stays the source transaction) — only the money's landing tender
changes. `giftCard` fields:

| Field         | Required | Description                                             |
| :------------ | :------- | :------------------------------------------------------ |
| `referenceId` | yes      | Card/account id you already credited. Missing → throws. |
| `processor`   | no       | Provider/program name. Defaults to `giftCard`.          |
| `label`       | no       | Human label for the destination tender.                 |

**Credit-first (same contract as `redeemRefund`).** You must credit the card
for the **sum of all `giftCard` legs BEFORE calling**. On any throw nothing was
recorded — reverse the credit. `referenceId` is required whenever `giftCard` is
present (throws up front otherwise).

An **all-`giftCard`** staging (every leg redirected, none back to source) is the
`redeemRefund` equivalent through this path and is allowed — **except** when a
cash-rounded capture would leave a rounding residue with no source-return leg to
carry it (a destination leg must never carry rounding). That staging is rejected
up front; keep at least one leg returning to a cash/card source, or use
`redeemRefund` for a pure gift-card refund.

## Notes

- This command processes the refund asynchronously through the refund handler system.
- The refund is created in the database and the order status is updated accordingly.
- Payment refunds are processed based on the original payment methods.
- Stock actions (restock/damage) are applied based on the refund details options.
- `openUI` defaults to `true`; existing callers keep the split-payment modal behavior for multi-tender orders.

## Per-item stock actions (restock vs damaged)

The old refund popup let a cashier choose, per product row, whether the returned
units go **back to stock** or are written off as **damaged**. The headless path
carries the same choice on each `product` item via `stockAction`:

```typescript
await command.processPartialRefund({
  orderId: 'order-123',
  openUI: false,
  items: [
    { itemKey: 'line-1', quantity: 1, type: 'product', stockAction: 'RESTOCK' },
    { itemKey: 'line-2', quantity: 2, type: 'product', stockAction: 'REFUND_DAMAGE' },
  ],
});
```

- `'RESTOCK'` — the returned units go back on the shelf. **This is the default**
  when `stockAction` is omitted, matching the popup's default first option.
- `'REFUND_DAMAGE'` — the units are written off as damaged, not restocked.

The value is recorded on the persisted refund line (the same field the popup's
per-row dropdown produced), so hub-side inventory ingest applies the disposition.
`stockAction` is ignored for non-`product` items — custom sales, fees and tips
carry no stock action, exactly as the popup only offered the choice on line items.

## Known limitation: `reason` is not persisted on this path

`reason` is accepted by this command but is **not** currently threaded through to
the persisted `Refund` doc or the state-event audit row on the item-selection
commit path (`legs` or the default proportional allocation) — the runtime's
refund dispatcher takes an unused `_reason` parameter here and falls back to a
fixed `'partial-refund'` label instead. Contrast with `redeemRefund`, whose
`reason` **is** recorded on the refund and audit rows. Flows that need the
reason to show up on the refund record should track it themselves (e.g. a
custom table row) until this is wired up; do not rely on it appearing on the
order's refund history.
