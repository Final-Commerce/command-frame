# redeemPayment

Initiates a redeem payment by calling `extensionPayment` with `paymentType: "redeem"`.

Use this when your extension handles a custom tender (for example gift card / wallet) and you want the host to record it as a redeem payment.

## Parameters

`params?: RedeemPaymentParams`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | `number` | No | Payment amount in major currency units |
| `processor` | `string` | No | Provider identifier (for reporting/troubleshooting) |
| `label` | `string` | No | Human-readable label shown in host payment records |
| `referenceId` | `string` | No | Provider-side reference ID |
| `extensionId` | `string` | No | Extension identifier override |
| `metadata` | `Record<string, unknown>` | No | Additional provider/context metadata |

## Response

`Promise<RedeemPaymentResponse>`

`RedeemPaymentResponse` is the same shape as `ExtensionPaymentResponse`.

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the host accepted/processed the payment |
| `amount` | `number \| null` | Applied payment amount |
| `paymentType` | `string` | Always `"redeem"` for this command |
| `order` | [`CFOrder`](../../types/README.md#cforder) `\| null` | Order snapshot returned by host |
| `timestamp` | `string` | ISO timestamp from the host |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.redeemPayment({
    amount: 25,
    processor: 'giftCard',
    label: 'Gift Card',
    referenceId: 'giftcard-tx-123',
    metadata: { cardLast4: '1234' },
});

console.log(result.paymentType); // "redeem"
```

## Constraints and Notes

- This command is a wrapper over `extensionPayment`; you cannot override `paymentType`.
- Host support for redeem/extension tenders must exist in the provider implementation.
- For refunds of redeem tenders, implement the host-initiated listener:
  - [extension-refund](../extension-refund/README.md)
