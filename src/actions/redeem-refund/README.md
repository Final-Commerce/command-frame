# redeemRefund

Records a refund of one or more order payments onto a gift-card or redeem tender.

## Parameters

`params: RedeemRefundParams`

| Parameter     | Type                      | Required | Description                                                                                                                                                                                                    |
| ------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`      | `number`                  | Yes      | Refund amount in integer minor currency units (e.g., 1575 = $15.75). Must be > 0 and within the order's remaining refundable capacity (tip-inclusive, across all source payments).                             |
| `referenceId` | `string`                  | Yes      | Destination card/account identifier (e.g., gift-card number). Recorded on every refund leg.                                                                                                                    |
| `orderId`     | `string`                  | No       | Order to refund; defaults to the active order.                                                                                                                                                                 |
| `processor`   | `string`                  | No       | Destination provider label; defaults to "giftCard".                                                                                                                                                            |
| `label`       | `string`                  | No       | Human-readable label for receipts/reporting.                                                                                                                                                                   |
| `extensionId` | `string`                  | No       | Extension identity, recorded on the legs when provided.                                                                                                                                                        |
| `metadata`    | `Record<string, unknown>` | No       | Opaque extension payload. Persisted (with `extensionId`) in each refund transaction's `paymentData` — read it back from the transaction rows, not from the order document's refund legs, which don't carry it. |
| `reason`      | `string`                  | No       | Cashier-facing reason, recorded on the refund and state-event audit rows.                                                                                                                                      |

## Response

`Promise<RedeemRefundResponse>`

| Field         | Type      | Description                                                        |
| ------------- | --------- | ------------------------------------------------------------------ |
| `success`     | `boolean` | Whether the refund was recorded successfully.                      |
| `orderId`     | `string`  | The order ID that was refunded.                                    |
| `amount`      | `number`  | Total refunded amount in minor currency units.                     |
| `referenceId` | `string`  | Echo of the destination identifier the legs were recorded against. |
| `legCount`    | `number`  | Number of source payments the amount was drawn from.               |
| `timestamp`   | `string`  | ISO timestamp of when the refund was recorded.                     |

## Global Constraints

**Credit-First Contract**: The flow must credit the gift-card in its own tables BEFORE calling this command. If `redeemRefund` throws, nothing is recorded and the flow reverses its credit.

## Supported Flows

### Cash-Order → Gift Card

Refund a cash order's payment back onto a gift card:

```typescript
const result = await command.redeemRefund({
  orderId: 'order_123',
  amount: 2500, // $25.00
  referenceId: 'GIFTCARD-456',
  processor: 'giftCard',
  label: 'Gift Card',
  reason: 'Customer requested return',
});
```

### Gift-Card Order → Existing Card (Redeem-Source Refund)

Refund a gift-card order back onto an existing card. This is now supported via `redeemRefund` only (plain `processPartialRefund` on redeem sources still fails by design).

**Same-Card Prefill Pattern**: Don't derive the amount from `order.paymentMethods` — the original captured amount ignores anything already refunded against that source, so it throws `REFUND_AMOUNT_EXCEEDS_CAPACITY` on a partially-refunded order. Query [`getRefundPlan`](../get-refund-plan/README.md) instead: it exposes the engine's own remaining capacity per source (`maxRefundable`), and for redeem sources the card number directly as `sources[].cardNumber` (parsed from the leg's `emv` JSON; present only for captures made by kaching ≥1.9.2):

```typescript
const plan = await command.getRefundPlan({ orderId: order._id });
const source = plan.sources.find((s) => s.paymentType === 'redeem' && s.maxRefundable > 0);
if (!source) throw new Error('nothing left to refund on a redeem source');

const result = await command.redeemRefund({
  orderId: order._id,
  amount: source.maxRefundable, // remaining capacity, NOT the original captured amount
  referenceId: source.cardNumber ?? (await promptForCardNumber()), // Re-use original card, or ask the cashier
  reason: 'Customer requested return',
});
```

## Failure Contract

If this command throws:

- **Nothing is recorded** on the order or in audit logs.
- The flow must **reverse any credits** it applied to the gift-card/redeem account.
- The order remains in its pre-call state.

## Order State Requirements

There is no payment-state gate in the runtime: any order with captured payments can be drawn from, including `partially_paid` orders. Capacity is computed per-source (`remainingRefundableOnSource`) — an order with nothing left to refund (e.g. fully refunded) simply has zero remaining capacity, so the command rejects it with the capacity error below rather than a distinct "not refundable" error.

There **is** a fulfillment-state gate, though: if this refund's amount is less than the order's full remaining refundable value (so the order lands on `partially_refunded` rather than `refunded`) and the order's fulfillment state is `draft`, `pending`, or `on_hold` (never fulfilled), the command is rejected — see "Partial refund on an unfulfilled order" below. Refund the full remaining amount instead, or fulfill/void the order first.

## EMV Data

The `emv` block lives on the **order's** payment and refund entries — `order.paymentMethods[].emv` for captures, `order.refund[].refundPayment[].emv` for refund legs — not on the local transaction row. That's the only flow-readable location for the card number:

```typescript
const emvData = JSON.parse(tx.emv);
const cardNumber = emvData['Card Number']; // e.g., '1234'
const brand = emvData['Brand']; // Processor sent; defaults to 'giftCard' if absent
```

This is the standard external-consumer location for EMV details. The local transaction row's `paymentData` carries `referenceId`/`processor`/`label` instead, but flows don't have access to it — only the order doc.

## Persistence Notes

When a refund is recorded:

- On the **order doc**: the refund leg's `emv` JSON carries the card number (`'Card Number'`) and brand; this is what flows read back.
- On the **local transaction row**: `processor`, `referenceId`, and `label` are persisted on `paymentData` — not readable by flows, but present for internal reporting/receipts.
- `metadata`/`extensionId` are stored in the refund **transaction rows'** `paymentData`, not on the order document's refund legs. (The capture-side `redeemPayment` is the command that does **not** persist `metadata` today.)
- The capture legs from the original tender retain their original `referenceId` (e.g., the gift-card number from `redeemPayment`) on their transaction row's `paymentData`, and their card number in `emv` on the order doc.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Refund a $25 payment onto a gift card
  const result = await command.redeemRefund({
    amount: 2500,
    referenceId: 'GIFTCARD-789',
    processor: 'giftCard',
    label: 'Gift Card Refund',
    reason: 'Customer request',
  });
  console.log(`Refunded ${result.amount} to card ${result.referenceId}`);
} catch (error) {
  console.error('Refund failed:', error.message);
  // Flow must reverse its credit to the gift-card account
}
```

## Error Handling

- **Permission**: throws `REFUND_PERMISSION_DENIED: active user lacks the 'issue_refunds' permission` when the active user's role doesn't grant `issue_refunds` (role-less user types bypass). Prefix-match `REFUND_PERMISSION_DENIED`; pre-gate your UI with [`checkPermission`](../check-permission/README.md).
- **Missing/invalid `amount`**: throws "redeemRefund: amount is required and must be a positive integer (minor currency units)" (kaching `handler.ts`)
- **Missing `referenceId`**: throws "redeemRefund: referenceId is required"
- **Invalid order ID**: throws "Order with ID {orderId} not found"
- **No active order**: throws "No order selected. Please provide orderId." when `orderId` is omitted and no order is currently active in the POS session.
- **Exceeds remaining capacity**: throws "REFUND_AMOUNT_EXCEEDS_CAPACITY: requested {amount} exceeds remaining refundable {totalCapacity}" (kaching `planRefund.ts`). Extensions matching on this should match the `REFUND_AMOUNT_EXCEEDS_CAPACITY` prefix, not the exact phrasing after it.
- **Partial refund on an unfulfilled order**: throws "refund.blocked: partial-refund-on-unfulfilled — Cannot partially refund an order that has not been fulfilled — use void or full refund instead" when this refund's amount is less than the order's full remaining refundable value and the order's fulfillment state is `draft`, `pending`, or `on_hold`. Prefix-match `refund.blocked`, not the guard/reason text that follows it. (kaching `runOrderOperation.ts` preflight)
- **Refund engine failure**: throws the order engine's own error message, or "refund.failed" if none is available, when the refund fails after preflight passes. (kaching `refundDispatcher.ts`)

The demo mock (`mock.ts`) approximates these gates for local development but doesn't reproduce the runtime strings exactly — match the runtime strings above, not the mock's.
