# redeemRefund

Records a refund of one or more order payments onto a gift-card or redeem tender.

## Parameters

`params: RedeemRefundParams`

| Parameter     | Type                      | Required | Description                                                                                                                                                                        |
| ------------- | ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`      | `number`                  | Yes      | Refund amount in integer minor currency units (e.g., 1575 = $15.75). Must be > 0 and within the order's remaining refundable capacity (tip-inclusive, across all source payments). |
| `referenceId` | `string`                  | Yes      | Destination card/account identifier (e.g., gift-card number). Recorded on every refund leg.                                                                                        |
| `orderId`     | `string`                  | No       | Order to refund; defaults to the active order.                                                                                                                                     |
| `processor`   | `string`                  | No       | Destination provider label; defaults to "giftCard".                                                                                                                                |
| `label`       | `string`                  | No       | Human-readable label for receipts/reporting.                                                                                                                                       |
| `extensionId` | `string`                  | No       | Extension identity, recorded on the legs when provided.                                                                                                                            |
| `metadata`    | `Record<string, unknown>` | No       | Opaque extension payload, recorded on the legs when provided. Note: `metadata` is not persisted on payment legs today; this is a future enhancement.                               |
| `reason`      | `string`                  | No       | Cashier-facing reason, recorded on the refund and state-event audit rows.                                                                                                          |

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

**Same-Card Prefill Pattern**: The order-doc `PaymentMethod` has no `paymentData` field — that field lives on the *local transaction row*, not on the order. If the original tender was a gift card, the card number is only readable from the leg's `emv` JSON, and only for captures made by kaching ≥1.9.2:

```typescript
const originalLeg = order.paymentMethods.find((pm) => pm.paymentType === 'redeem');
let cardNumber: string | undefined;
try {
  cardNumber = originalLeg.emv ? JSON.parse(originalLeg.emv)['Card Number'] : undefined;
} catch {
  // emv missing/unparseable (older capture) — fall through to manual input
}
const result = await command.redeemRefund({
  orderId: order._id,
  amount: originalLeg.amount,
  referenceId: cardNumber ?? (await promptForCardNumber()), // Re-use original card, or ask the cashier
  reason: 'Customer requested return',
});
```

## Failure Contract

If this command throws:

- **Nothing is recorded** on the order or in audit logs.
- The flow must **reverse any credits** it applied to the gift-card/redeem account.
- The order remains in its pre-call state.

## Order State Requirements

There is no state gate in the runtime: any order with captured payments can be drawn from, including `partially_paid` orders. Capacity is computed per-source (`remainingRefundableOnSource`) — an order with nothing left to refund (e.g. fully refunded) simply has zero remaining capacity, so the command rejects it with the capacity error below rather than a distinct "not refundable" error.

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
- `metadata` is **not** stored on payment legs today (future enhancement).
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

- **Missing/invalid `amount`**: throws "redeemRefund: amount is required and must be a positive integer (minor currency units)" (kaching `handler.ts`)
- **Missing `referenceId`**: throws "redeemRefund: referenceId is required"
- **Invalid order ID**: throws "Order with ID {orderId} not found"
- **Exceeds remaining capacity**: throws "REFUND_AMOUNT_EXCEEDS_CAPACITY: requested {amount} exceeds remaining refundable {totalCapacity}" (kaching `planRefund.ts`). Extensions matching on this should match the `REFUND_AMOUNT_EXCEEDS_CAPACITY` prefix, not the exact phrasing after it.

The demo mock (`mock.ts`) approximates these gates for local development but doesn't reproduce the runtime strings exactly — match the runtime strings above, not the mock's.
