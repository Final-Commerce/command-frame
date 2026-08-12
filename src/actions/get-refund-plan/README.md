# getRefundPlan

**Read-only.** Returns the refund engine's own capacity math for an order —
per-source and order-level — so a flow can present accurate refund options
**without re-deriving the numbers client-side**. A flow that computes its own
per-tender caps will drift from the engine and get rejected at submit time;
query this instead.

## Parameters

`params?: GetRefundPlanParams`

| Parameter | Type     | Required | Description                                   |
| --------- | -------- | -------- | --------------------------------------------- |
| `orderId` | `string` | No       | Order to inspect; defaults to the active order. |

## Response

`Promise<GetRefundPlanResponse>`

| Field                   | Type                | Description                                                                                       |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| `success`               | `boolean`           | Always `true` on a resolved order (throws otherwise).                                             |
| `orderId`               | `string`            | The order the plan was computed for.                                                              |
| `sources`               | `RefundPlanSource[]` | One row per original captured tender on the order (refund legs excluded).                        |
| `remainingRefundable`   | `number`            | Order-level remaining refundable (minor units), **non-revenue liability already excluded**.       |
| `nonRefundableLiability`| `number`            | Non-refundable liability (gift-card loads etc., minor units).                                     |
| `totalCaptured`         | `number`            | Total captured across the order (principal + tips, minor units).                                 |
| `totalRefunded`         | `number`            | Total already refunded across the order (minor units).                                            |
| `timestamp`             | `string`            | ISO timestamp of the read.                                                                        |

### `RefundPlanSource`

| Field               | Type      | Description                                                                                          |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `transactionId`     | `string`  | The source payment's transaction id — the key a refund leg draws against.                           |
| `paymentType`       | `string`  | `cash` / `card` / `redeem` / etc.                                                                    |
| `processor`         | `string?` | Processor label, when the capture recorded one.                                                     |
| `capturedAmount`    | `number`  | Captured on this payment — **principal + captured tip** (minor units), matching the engine's capacity. |
| `refundedAmount`    | `number`  | Already refunded against this source (minor units).                                                 |
| `maxRefundable`     | `number`  | Remaining refundable on this source (minor units) — the engine's own per-source cap.                |
| `refundableToSource`| `boolean` | `false` for a `redeem` source with no gift-card destination (a plain refund to it hard-fails).       |
| `cardNumber`        | `string?` | For redeem sources: the card number from the payment entry's `emv`, when present.                   |

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

const plan = await command.getRefundPlan({ orderId: 'order_123' });

// Prefill per-tender refund inputs straight from the engine's caps.
const legs = plan.sources
  .filter((s) => s.maxRefundable > 0)
  .map((s) => ({
    transactionId: s.transactionId,
    amount: s.maxRefundable,
    // Same-card prefill for a gift-card tender.
    ...(s.paymentType === 'redeem' && s.cardNumber
      ? { giftCard: { referenceId: s.cardNumber } }
      : {}),
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
