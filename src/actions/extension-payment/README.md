# extensionPayment

Initiates an extension-defined payment flow in the host by calling the `extensionPayment` command action. Use this when your extension supports non-core payment methods and you need to tell the host which `paymentType` to process.

## Parameters

`params?: ExtensionPaymentParams`

| Parameter      | Type                      | Required                             | Description                                                                                                                                                          |
| :------------- | :------------------------ | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paymentType`  | `string`                  | `true`                                | Must be `"redeem"` (gift cards, store credit, and other non-card extension tenders) or `"integration"` (extension-authorized card-style payments). Any other value is rejected with `Unsupported extension payment type: <value>`. |
| `processor`    | `string`                  | `false`                               | Provider/processor identifier recorded on the payment record (defaults to `"giftCard"` for `redeem`, `"integration"` for `integration` when omitted).              |
| `amount`       | `number`                  | `true`                                | Required, integer minor units; below the balance due → partial payment (fixed split leg); above → error.                                                           |
| `label`        | `string`                  | `false`                               | Display label for the payment entry.                                                                                                                                |
| `referenceId`  | `string`                  | `false`                               | External payment reference (extension-side id).                                                                                                                     |
| `extensionId`  | `string`                  | `false`                               | Extension identifier. Recorded on the payment record only when `paymentType` is `"integration"`; not persisted for `"redeem"`.                                     |
| `metadata`     | `Record<string, unknown>` | `false`                               | Extra provider-specific data. Recorded on the payment record only when `paymentType` is `"integration"`; not persisted for `"redeem"`.                             |
| `checkoutFulfillmentTarget` | `string`     | `false`                               | Overrides the fulfillment state the order lands in on full payment; validated against the fulfillment state machine. Omitted: preserves advanced fulfillment, auto-fulfills from draft/pending/on_hold. An invalid value throws `<paymentType>Payment: invalid checkoutFulfillmentTarget "<value>"` rather than being silently dropped. |
| `emvData`      | `unknown`                 | conditional (required for `integration`) | Card-style EMV fields (`brand`, `cardholderName`, `country`, `expiryDate`, `issuer`, `cardNumberLast4`). Required when `paymentType` is `"integration"`; unused for `"redeem"`.       |
| `processorFee` | `number`                  | `false`                               | Processor fee, integer minor units. Recorded on the order's `paymentMethod.processorFee` only when `paymentType` is `"integration"`; not persisted for `"redeem"`. |

## Response

`Promise<ExtensionPaymentResponse>`

| Field         | Type              | Description                                                                         |
| :------------ | :---------------- | :---------------------------------------------------------------------------------- |
| `success`          | `boolean`         | `true` when host payment handling completed successfully.                           |
| `amount`           | `number \| null`  | Processed amount reported by host, in integer minor currency units.                 |
| `paymentType`      | `string`          | Final payment type recorded on the payment entry (`"redeem"` or `"integration"`).   |
| `order`            | `CFOrder \| null` | Order snapshot after payment processing. Can be `null` for in-progress split flows. |
| `change`           | `number`          | Cash change due back, integer minor units. Always `0` for extension payments (no cash tender). |
| `cashRounding`     | `number`          | Signed cash-rounding delta, integer minor units. Always `0` for extension payments (rounding only applies to cash legs). |
| `saleFinalized`    | `boolean`         | `true` only when this leg finalized the sale (the last, or only, leg captured).      |
| `remainingBalance` | `number`          | Balance still due after this leg, integer minor units; `0` when finalized.           |
| `timestamp`        | `string`          | ISO timestamp produced by host action handler.                                      |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Extension-authorized card-style payment
const result = await command.extensionPayment({
  paymentType: 'integration',
  processor: 'myCardProvider',
  amount: 2500, // 2500 minor units = $25.00
  label: 'My Card Reader',
  referenceId: 'provider-sale-123',
  emvData: { brand: 'Visa', cardNumberLast4: '7890' },
  metadata: { authCode: 'ABC123' },
});

console.log(result.success, result.paymentType, result.order?._id);
```

## Notes

- `extensionPayment` is the generic primitive; `redeemPayment` and [`integrationPayment`](../integration-payment/README.md) are convenience wrappers that force `paymentType: "redeem"` / `"integration"` respectively.
- The host currently implements exactly these two payment types (`redeem`, `integration`); any other `paymentType` is rejected with `Unsupported extension payment type: <value>`.
- Refunds of extension/redeem tenders are supported via the `redeemRefund` command: plain refunds on redeem sources still fail by design (`REDEEM_REFUND_UNSUPPORTED`), but refunding onto a gift card is supported when the extension credits the card first. See [redeemRefund](../redeem-refund/README.md) for details.
