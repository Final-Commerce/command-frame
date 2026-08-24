# getRefundPlan

**Read-only.** Returns the refund engine's own capacity math for an order —
per-source and order-level — so a flow can present accurate refund options
**without re-deriving the numbers client-side**. A flow that computes its own
per-tender caps will drift from the engine and get rejected at submit time;
query this instead.

## Parameters

`params?: GetRefundPlanParams`

| Parameter | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `orderId` | `string` | No       | Order to inspect; defaults to the active order. |

## Response

`Promise<GetRefundPlanResponse>`

| Field                    | Type                    | Description                                                                                                                             |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `success`                | `boolean`               | Always `true` on a resolved order (throws otherwise).                                                                                   |
| `orderId`                | `string`                | The order the plan was computed for.                                                                                                    |
| `sources`                | `RefundPlanSource[]`    | One row per original captured tender on the order (refund legs excluded).                                                               |
| `allocation`             | `RefundPlanAllocation?` | The engine's own split of the CURRENT selection — submit-ready `legs`. Present only when a refund selection exists on the active order. |
| `remainingRefundable`    | `number`                | Order-level remaining refundable (minor units), **non-revenue liability already excluded**.                                             |
| `nonRefundableLiability` | `number`                | Non-refundable liability (gift-card loads etc., minor units).                                                                           |
| `totalCaptured`          | `number`                | Total captured across the order (principal + tips, minor units).                                                                        |
| `totalRefunded`          | `number`                | Total already refunded across the order (minor units).                                                                                  |
| `timestamp`              | `string`                | ISO timestamp of the read.                                                                                                              |

### `RefundPlanSource`

| Field                | Type      | Description                                                                                            |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `transactionId`      | `string`  | The source payment's transaction id — the key a refund leg draws against.                              |
| `paymentType`        | `string`  | `cash` / `card` / `redeem` / etc.                                                                      |
| `processor`          | `string?` | Processor label, when the capture recorded one.                                                        |
| `capturedAmount`     | `number`  | Captured on this payment — **principal + captured tip** (minor units), matching the engine's capacity. |
| `refundedAmount`     | `number`  | Already refunded against this source (minor units).                                                    |
| `maxRefundable`      | `number`  | Remaining refundable on this source (minor units) — the engine's own per-source cap.                   |
| `refundableToSource` | `boolean` | `false` for a `redeem` source with no gift-card destination (a plain refund to it hard-fails).         |
| `cardNumber`         | `string?` | For redeem sources: the card number from the payment entry's `emv`, when present.                      |

### `RefundPlanAllocation`

| Field       | Type              | Description                                                                                                       |
| ----------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `budget`    | `number`          | What Σ `legs.amount` **must** equal. `min(itemTotal, Σ maxRefundable)` — on a full selection, the captured total. |
| `itemTotal` | `number`          | Goods value of the selection. **Display only** — never allocate against it.                                       |
| `rounding`  | `number`          | `budget − itemTotal`: the sale's cash rounding, returned to the tender that took it.                              |
| `legs`      | `RefundPlanLeg[]` | One leg per source that receives money. Pass to `processPartialRefund` **unchanged**.                             |

### `RefundPlanLeg`

| Field                         | Type      | Description                                                                                         |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `transactionId`               | `string`  | Source payment this leg draws from — the join key back to `sources`.                                |
| `amount`                      | `number`  | Amount to return to that source (minor units). **Submit verbatim.**                                 |
| `paymentType`                 | `string`  | Copied from the source, for display grouping.                                                       |
| `requiresGiftCardDestination` | `boolean` | `true` for a `redeem` source — the leg needs a `giftCard` destination, credited **first**.          |
| `payout`                      | `object?` | Cash legs only: `{ amount, rounding }` — what the drawer pays after the snap, and the signed delta. |

## Render the allocation — do not compute one

`sources` tells you what each tender _can_ take; `allocation` tells you what
each tender _does_ take for the selection in play. A flow needs no arithmetic
between the two:

```typescript
await command.selectAllRefundItems();
const plan = await command.getRefundPlan();

// UI: render plan.allocation.legs (amount, payout) — nothing derived.
// Submit: the same array, unchanged.
await command.processPartialRefund({ openUI: false, legs: plan.allocation!.legs });
```

Splitting `itemTotal` across the tenders yourself is the one thing this field
exists to prevent. On a cash-rounded sale `budget` exceeds `itemTotal` — the
till took the rounding, and it is owed back to the **cash** tender. A
proportional split spreads that difference over every tender instead, shaving
cents off gift-card legs that must be returned exactly as redeemed, and
`processPartialRefund` rejects it with `refund.legSumMismatch`.

## What each number means

- **`capturedAmount`** includes any captured tip on the tender, because the
  engine's per-source capacity does — a refund leg against a source can cover
  either its principal or its tip.
- **`maxRefundable`** is the exact per-source ceiling the mutating commands
  enforce: `capturedAmount − refundedAmount`. Allocate a refund across
  `sources` using these caps and the engine will accept it.
- **`remainingRefundable`** is the order-level ceiling a refund is **allowed**
  to move — it already carves out `nonRefundableLiability` (a gift-card load
  the customer paid for can never be handed back through a refund). It is
  **not** the same as `Σ maxRefundable`, which is the raw settlement figure.

## Query — never recompute

Read these numbers; do not reconstruct them from `order.summary` /
`order.paymentMethods` yourself. The engine's capacity accounting (prior
refunds netted per source, tips folded into capacity, non-revenue carved out)
is intricate and a client-side copy **will** drift.

## Same-card prefill via `cardNumber`

For a `redeem` source, `cardNumber` is the gift-card number pulled from that
capture's `emv` block (kaching ≥ 1.9.2). Use it to prefill "refund back to the
same card" without asking the cashier to retype it; when it's absent (older
capture), fall back to a manual input.

## These numbers are advisory reads

The values are a **point-in-time snapshot**. A concurrent refund on the same
order can change them between this read and your submit. The mutating command
(`processPartialRefund` / `redeemRefund`) **re-validates** capacity at commit
time and rejects an over-capacity request with `REFUND_AMOUNT_EXCEEDS_CAPACITY`
— so treat this plan as guidance for the UI, and always handle a rejection
from the mutating call.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const plan = await command.getRefundPlan({ orderId: '66b1c2d3e4f5a6b7c8d9e0f1' });

// With a selection in play, `plan.allocation.legs` is the answer — see
// "Render the allocation" above. The manual staging below is for a UI that
// lets the cashier choose the per-tender amounts: the caps are the per-row
// maximums, and the entered amounts must still total `allocation.budget`.
```

```typescript
// Prefill per-tender refund inputs straight from the engine's caps.
// A redeem source is only a valid leg when it carries a gift-card
// destination — skip sources the engine can't refund to directly
// (`refundableToSource: false`, i.e. redeem with no `cardNumber`)
// unless you collect a destination card from the cashier.
const legs = plan.sources
  .filter((s) => s.maxRefundable > 0)
  .filter((s) => s.refundableToSource || (s.paymentType === 'redeem' && s.cardNumber))
  .map((s) => ({
    transactionId: s.transactionId,
    amount: s.maxRefundable,
    // Same-card prefill for a gift-card tender.
    ...(s.paymentType === 'redeem' && s.cardNumber ? { giftCard: { referenceId: s.cardNumber } } : {}),
  }));

console.log(`Up to ${plan.remainingRefundable} refundable on this order.`);
```

## Errors

- **Invalid order ID**: throws `Order with ID {orderId} not found`.
- **No order selected and no `orderId`**: throws `No order selected. Please provide orderId.`

The demo mock (`mock.ts`) derives the rows from the mock order's payment
methods but, lacking a refund ledger and `emv` data, always reports
`refundedAmount`/`totalRefunded` of `0` and no `cardNumber` — shape only, not
real capacity.
