# processPartialRefund

Processes a partial refund based on the current refund selections in the refund details state.

## Parameters

`params?: ProcessPartialRefundParams`

| Parameter  | Type      | Required | Description                                                                                                                                                                                                                                             |
| :--------- | :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reason`   | `string`  | `false`  | Optional reason for the refund.                                                                                                                                                                                                                         |
| `orderId`  | `string`  | `false`  | Optional order to refund (sets it active first).                                                                                                                                                                                                        |
| `items`    | `array`   | `false`  | Optional items to select for refund before processing. A `product` entry may carry `stockAction` — see "Per-item stock actions" below.                                                                                                                  |
| `openUI`   | `boolean` | `false`  | Multi-tender only. Defaults to `true`. See "Multi-tender orders" below.                                                                                                                                                                                 |
| `legs`     | `array`   | `false`  | Explicit per-tender allocation (minor units); a leg may carry a `giftCard` destination for mixed returns. Requires `openUI: false`. See "Choosing which payments to refund to" and "Mixed returns" below.                                               |
| `giftCard` | `object`  | `false`  | Route part or all of the refund onto ONE card and let the engine allocate the rest. `{ referenceId, amount?, processor?, label? }`. Requires `openUI: false`; mutually exclusive with `legs`. See "Refunding onto a card without doing the math" below. |

## Response

`Promise<ProcessPartialRefundResponse>`

| Field       | Type      | Description                                                                                                                                                                          |
| :---------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `success`   | `boolean` | `true` if the refund processing was initiated successfully.                                                                                                                          |
| `refundId`  | `string`  | Always the literal string `'processed'`. A real refund ID is generated and persisted on the `Refund` doc internally, but this command does not currently surface it in the response. |
| `timestamp` | `string`  | ISO date string of when the action occurred.                                                                                                                                         |

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
  //   refundId: 'processed', // always this literal string, not a generated ID — see Response above
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }
} catch (error) {
  console.error('Failed to process refund:', error);
}
```

## Error Handling

- **Permission**: throws `REFUND_PERMISSION_DENIED: active user lacks the 'issue_refunds' permission` when the active user's role doesn't grant `issue_refunds` (role-less user types — company owner, final/org staff — bypass). Prefix-match `REFUND_PERMISSION_DENIED`; pre-gate your UI with [`checkPermission`](../check-permission/README.md).
- Throws `Order with ID {orderId} not found` when the passed `orderId` doesn't match any order.
- Throws an error if no order is currently active.
- Throws an error if no refund details exist.
- Throws an error if no items are selected for refund.
- Throws `refund.partialNotAllowedOnUnfulfilled` when the order's fulfillment state is `draft`, `pending`, or `on_hold` — a partial refund requires an already-fulfilled order; void the order instead.

```typescript
// Example of error when no items selected
try {
  await command.processPartialRefund();
} catch (error) {
  console.error(error.message); // "No items selected for refund. Please select items to refund first."
}
```

## Refund recipes — with and without gift cards

Two shapes cover almost every headless refund. Both start the same way: **ask
`getRefundPlan` for the allocation and submit it unchanged.** Never split a
refund total across tenders yourself — the engine allocates against its
allocatable _budget_, not the goods value, and on a cash-rounded sale those
differ by the rounding the till kept. A client-side split shaves cents off legs
that must be exact and is rejected with `refund.legSumMismatch`.

### A. No gift cards (cash / card / any refundable-to-source tender)

Nothing to credit first — the money goes straight back to the tenders it came
from.

```typescript
const items = [{ itemKey: 'line-1', quantity: 1, type: 'product' }];
const plan = await command.getRefundPlan({ orderId, items });

await command.processPartialRefund({
  orderId,
  items, // the SAME array the plan was built from
  openUI: false,
  legs: plan.allocation!.legs, // verbatim — no arithmetic
});
```

You can also simply omit `legs`: with `openUI: false` the engine runs that same
allocation itself. Pass them when you want to _show_ the split first, so what
the cashier saw is exactly what commits.

### B. Gift cards involved (`redeem` sources) — credit-first, per card

A `redeem` leg can't return to itself: the POS cannot push money onto a card, so
each one needs a `giftCard` destination and the flow must credit that card
**before** calling. Two rules people get wrong:

1. **Each leg names its OWN card.** `giftCard.referenceId` is per leg — an order
   paid with three gift cards refunds three cards, each getting back what it
   paid. `getRefundPlan` hands you each source's `cardNumber` for exactly this.
   Stamping one card on every leg pushes the whole refund onto that card.
2. **Reverse only what you actually credited.** If the refund throws, undo the
   credits — but a credit your ledger skipped as a replay was never written by
   this attempt, and reversing it debits a card for money it legitimately holds.

```typescript
const plan = await command.getRefundPlan({ orderId, items });
const bySource = new Map(plan.sources.map((s) => [s.transactionId, s]));

// Each redeem leg goes home to the card that paid it.
const legs = plan.allocation!.legs.map((leg) => {
  const card = bySource.get(leg.transactionId)?.cardNumber;
  return leg.requiresGiftCardDestination && card ? { ...leg, giftCard: { referenceId: card } } : leg;
});

// CREDIT-FIRST: the card ledger moves before the POS records anything.
const credited: { cardNumber: string; amountMinor: number }[] = [];
try {
  for (const leg of legs) {
    if (!leg.giftCard) continue;
    const res = await creditCard(leg.giftCard.referenceId, leg.amount);
    if (!res.alreadyCredited) credited.push({ cardNumber: leg.giftCard.referenceId, amountMinor: leg.amount });
  }
  await command.processPartialRefund({ orderId, items, openUI: false, legs });
} catch (err) {
  for (const c of credited) await reverseCredit(c); // only this attempt's writes
  throw err;
}
```

A `redeem` source shows up as `refundableToSource: false` — that is **not** a
reason to hide "refund to original payments". It only means the leg needs a
destination, which the card number gives you. Sending everything to one card is
a fallback for when a capture has no `cardNumber` (older orders), not the
default.

To put money on a card _instead of_ returning it to source — a store-credit
return — see **Mixed returns** and **Refunding onto a card without doing the
math** below.

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
- **A leg drawing from a gift-card / store-credit (`redeem`) source must carry a `giftCard` destination.** The engine can't push money onto a card without the flow's credit-first cooperation — a `redeem`-source leg without `giftCard` throws (`REDEEM_REFUND_UNSUPPORTED`).

Cash legs receive the same drawer-rounding and residue handling the modal
applied, so the engine's refund invariants hold. Omit `legs` (with
`openUI: false`) to fall back to the default proportional allocation across all
sources.

> **Mock divergence:** the standalone mock does **not** enforce the `legs`
> validation above (negative amounts, unknown `transactionId`s and missing
> `giftCard.referenceId` all "succeed" outside the iframe). Test the error
> paths against the real runtime.

## Refunding onto a card without doing the math

`legs` makes you decide, tender by tender, where every cent goes. When the
destination is a gift card you usually do not want that decision — you want to
say _"put this much on the card, send the rest home"_ and let the engine
allocate, exactly as it does for every other refund path.

That is `giftCard`:

```typescript
// Refund the selection. C$5.00 lands on card GC1; whatever is left goes back to
// the original payments, allocated by the engine.
await creditCard('GC1', 500); // credit-first, your ledger
await command.processPartialRefund({
  orderId: 'order-123',
  items: [{ itemKey: 'line-1', quantity: 1, type: 'product' }],
  openUI: false,
  giftCard: { referenceId: 'GC1', amount: 500 },
});
```

Omit `amount` and the whole refund lands on the card — the same end state as an
all-`giftCard` `legs` staging, without building one.

**Prefer this over `legs` for a card destination.** A flow that computes its own
split is re-deriving engine arithmetic, and mirrored money math drifts: the
allocation has to account for cash-rounding payouts, per-tender capacity and
prior refunds, all of which the engine already knows and you do not.

### Drawing order, and the one error to render

The card is filled from the tenders that **cannot** be refunded to source first —
a redeem tender has nowhere to return to — then proportionally from the rest.

So `amount` has a floor: it can never be less than what those tenders must
contribute. Below it, the call throws and nothing is committed:

```
REFUND_GIFT_AMOUNT_BELOW_MINIMUM: gift-card amount 200 is below the 989 that
tenders which cannot be refunded to source must contribute
```

The message carries the minimum, so **that** is the number to clamp your field
to — you never have to derive it. Surface the message verbatim, as with every
other staging error.

### Why exactly one card

`giftCard` names a single destination, so there is exactly one credit for you to
place and one to reverse. That is deliberate: draining the redeem tenders onto
the new card first is what keeps the remainder returnable to ordinary tenders,
which is what keeps the count at one. If you genuinely need two destination
cards in one refund, that is what `legs` is still for.

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

## `reason` persistence

`reason` is recorded verbatim on the persisted `Refund` doc's `reason` field and
on the state-event audit row, on every commit path (default allocation, `legs`,
full refund) — same as `redeemRefund`. When omitted, the refund doc's `reason`
stays unset and only the audit row carries the `'partial-refund'` /
`'full-refund'` fallback label.
