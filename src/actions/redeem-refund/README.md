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

**Same-Card Prefill Pattern**: If the original tender was a gift card, you can read the card number from the original redeem leg's `paymentData.referenceId` and pass it back as the destination `referenceId`:

```typescript
const originalLeg = order.paymentMethods.find((pm) => pm.paymentType === 'redeem');
const result = await command.redeemRefund({
  orderId: order._id,
  amount: originalLeg.amount,
  referenceId: originalLeg.paymentData?.referenceId, // Re-use original card
  reason: 'Customer requested return',
});
```

## Failure Contract

If this command throws:

- **Nothing is recorded** on the order or in audit logs.
- The flow must **reverse any credits** it applied to the gift-card/redeem account.
- The order remains in its pre-call state.

## Order State Requirements

Orders must be in `paid` or `partially_refunded` state to be refundable via this command. States like `unpaid`, `refunded`, or `voided` will cause the command to throw with `ORDER_NOT_REFUNDABLE`.

## EMV Data

For both payment and refund transactions, the card number is readable at the canonical EMV location:

```typescript
const emvData = JSON.parse(tx.emv);
const cardNumber = emvData['Card Number']; // e.g., '1234'
const brand = emvData['Brand']; // Processor sent; defaults to 'giftCard' if absent
```

This is the standard external-consumer location for EMV details.

## Persistence Notes

When a refund is recorded:

- `processor`, `referenceId`, and `label` are persisted on the refund legs.
- `metadata` is **not** stored on payment legs today (future enhancement).
- The capture legs from the original tender retain their original `referenceId` (e.g., the gift-card number from `redeemPayment`).

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

- **Missing `amount`**: throws "Amount must be greater than 0"
- **Missing `referenceId`**: throws "referenceId is required"
- **Invalid order ID**: throws "Order with ID {orderId} not found"
- **Non-refundable order state**: throws "ORDER_NOT_REFUNDABLE: order {orderId} is '{state}' — only 'paid' or 'partially_refunded' orders can be refunded"
- **Exceeds remaining capacity**: throws "Refund amount {amount} exceeds remaining refundable capacity {remainingCapacity}"
