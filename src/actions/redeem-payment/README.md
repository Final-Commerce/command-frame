# redeemPayment

Initiates a redeem payment by calling `extensionPayment` with `paymentType: "redeem"`.

Use this when your extension handles a custom tender (for example gift card / wallet) and you want the host to record it as a redeem payment.

## Parameters

`params?: RedeemPaymentParams`

| Parameter                   | Type                      | Required | Description                                                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `amount`                    | `number`                  | Yes      | Required, integer minor units; below the balance due → partial payment (fixed split leg); above → error.                                                                                                                                                                             |
| `processor`                 | `string`                  | No       | Provider identifier (for reporting/troubleshooting); defaults to `"giftCard"` when omitted.                                                                                                                                                                                          |
| `label`                     | `string`                  | No       | Human-readable label shown in host payment records                                                                                                                                                                                                                                   |
| `referenceId`               | `string`                  | No       | Provider-side reference ID. Also stamped into the payment's `emv` field as `{ Brand: processor, "Card Number": referenceId }` — the location `redeemRefund`'s same-card prefill reads back.                                                                                          |
| `extensionId`               | `string`                  | No       | Extension identifier. Accepted by the type but **not persisted** by the redeem-payment handler today (unlike `integrationPayment`, which does record it).                                                                                                                            |
| `metadata`                  | `Record<string, unknown>` | No       | Additional provider/context metadata. Accepted by the type but **not persisted** by the redeem-payment handler today.                                                                                                                                                                |
| `checkoutFulfillmentTarget` | `string`                  | No       | Override the fulfillment state the order lands in on full payment (validated against the fulfillment state machine; invalid values throw `redeemPayment: invalid checkoutFulfillmentTarget "..."`). Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. |

## Response

`Promise<RedeemPaymentResponse>`

`RedeemPaymentResponse` is the same shape as `ExtensionPaymentResponse`.

| Field              | Type                                                 | Description                                                                                                                |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `success`          | `boolean`                                            | Whether the host accepted/processed the payment                                                                            |
| `amount`           | `number \| null`                                     | Applied payment amount, in integer minor currency units                                                                    |
| `paymentType`      | `string`                                             | Always `"redeem"` for this command                                                                                         |
| `order`            | [`CFOrder`](../../types/README.md#cforder) `\| null` | Order snapshot returned by host. `null` on a non-final split leg — only the leg that finalizes the sale returns the order. |
| `change`           | `number`                                             | Cash change due back, integer minor units. Always `0` for redeem payments (no cash tender).                                |
| `cashRounding`     | `number`                                             | Signed cash-rounding delta, integer minor units. Always `0` for redeem payments (rounding only applies to cash legs).      |
| `saleFinalized`    | `boolean`                                            | `true` only when this leg finalized the sale (the last, or only, leg captured).                                            |
| `remainingBalance` | `number`                                             | Balance still due after this leg, integer minor units; `0` when finalized.                                                 |
| `timestamp`        | `string`                                             | ISO timestamp from the host                                                                                                |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.redeemPayment({
  amount: 2500, // $25.00 in minor units
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
- Refunds of redeem tenders are supported via the `redeemRefund` command: plain refunds on redeem sources still fail by design (`REDEEM_REFUND_UNSUPPORTED`), but refunding onto a gift card is supported when the extension credits the card first. See [redeemRefund](../redeem-refund/README.md) for details.

## Error Handling

Every failure below **rejects the returned promise** — the handler never resolves with `success: false`.

- Missing `amount`: throws `redeemPayment requires: amount`.
- Empty cart: throws `Cart is empty. Cannot process payment.`
- `amount` is not a positive integer (on a cart with a balance due greater than `$0`): throws `redeemPayment: amount must be a positive integer (minor units)`.
- `amount` exceeds the balance due: throws `redeemPayment: amount {amount} exceeds the balance due {balanceDue}`.
- Invalid `checkoutFulfillmentTarget` (not a recognized fulfillment state): throws `redeemPayment: invalid checkoutFulfillmentTarget "..."`.
- A cancelled payment (e.g. a dismissed modal mid-flow) surfaces as `Payment cancelled` rather than the underlying error.

## Events

- Publishes a `payment-done` event on the `payments` topic when this tender fully completes the sale (`saleFinalized: true` — a single-tender payment or the final leg of a split): `{ payment, order, amount }`, where `payment` is the order's last captured payment-method entry, `order` is the completed order, and `amount` is that payment's captured amount as a string (minor units). Not published for a mid-flight split leg.
