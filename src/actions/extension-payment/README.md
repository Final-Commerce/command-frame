# extensionPayment

Initiates an extension-defined payment flow in the host by calling the `extensionPayment` command action. Use this when your extension supports non-core payment methods and you need to tell the host which `paymentType` to process.

## Parameters

`params?: ExtensionPaymentParams`

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `paymentType` | `string` | `true` | Payment type key used by the host handler (for example `redeem`, `gift-card`, `store-credit`). |
| `processor` | `string` | `false` | Provider/processor identifier for host-side routing or metadata. |
| `amount` | `number` | `false` | Amount to charge in major currency units. If omitted, host may use cart remaining total. |
| `label` | `string` | `false` | Display label for the payment entry. |
| `referenceId` | `string` | `false` | External payment reference (extension-side id). |
| `extensionId` | `string` | `false` | Extension identifier when multiple extension handlers exist. |
| `metadata` | `Record<string, unknown>` | `false` | Extra provider-specific data forwarded to host payment handling. |

## Response

`Promise<ExtensionPaymentResponse>`

| Field | Type | Description |
| :-- | :-- | :-- |
| `success` | `boolean` | `true` when host payment handling completed successfully. |
| `amount` | `number \| null` | Processed amount reported by host. |
| `paymentType` | `string` | Final payment type recorded on the payment entry. |
| `order` | `CFOrder \| null` | Order snapshot after payment processing. Can be `null` for in-progress split flows. |
| `timestamp` | `string` | ISO timestamp produced by host action handler. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Generic extension payment
const result = await command.extensionPayment({
    paymentType: 'gift-card',
    processor: 'myGiftCardProvider',
    amount: 25,
    label: 'Gift Card',
    referenceId: 'provider-sale-123',
    metadata: { cardLast4: '7890' }
});

console.log(result.success, result.paymentType, result.order?._id);
```

## Notes

- `extensionPayment` is the generic primitive; `redeemPayment` is a convenience wrapper that forces `paymentType: "redeem"`.
- The host must implement an `extensionPayment` action handler for your payment type.
- If your payment type behaves like redeem/gift-card tender in POS refunds, also implement the host-initiated refund listener documented in [`../extension-refund/README.md`](../extension-refund/README.md).
