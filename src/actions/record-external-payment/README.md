# recordExternalPayment

Records a payment that was taken **outside the terminal** — paid online, through a delivery app, with a voucher — under a label saying what it was. **No money is taken at the POS**: no card reader, no cash drawer, no change, no tip prompt, no cash rounding. Otherwise it behaves like any tender: the order is paid, moves through the order state machine normally (Completed once fulfilled), and reports show the amount under the label.

Omit `amount` to record the whole balance and complete the order. Pass an `amount` to record part of it, and take the rest with another tender (e.g. a deposit paid online, the balance in cash).

## Parameters

`params: RecordExternalPaymentParams`

| Parameter                   | Type     | Required | Description                                                                                                                                       |
| :-------------------------- | :------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`                     | `string` | `true`   | What the payment was, shown on the order and in reports (e.g. `Paid online`). Trimmed; not checked against a list — use consistent labels.        |
| `amount`                    | `number` | `false`  | Integer minor units. Omitted → the full balance due. Below the balance → a partial payment (split leg). Above → error.                            |
| `checkoutFulfillmentTarget` | `string` | `false`  | Fulfillment state to land on after full payment — e.g. `'pending'` to keep the order going to the kitchen instead of completing it straight away. |

## Response

`Promise<RecordExternalPaymentResponse>`

| Field              | Type              | Description                                                  |
| :----------------- | :---------------- | :----------------------------------------------------------- |
| `success`          | `boolean`         | `true` when the payment was recorded.                        |
| `amount`           | `number`          | Amount recorded, minor units.                                |
| `label`            | `string`          | Label as recorded.                                           |
| `paymentType`      | `'external'`      |                                                              |
| `change`           | `number`          | Always `0`.                                                  |
| `cashRounding`     | `number`          | Always `0`.                                                  |
| `order`            | `CFOrder \| null` | The order once the sale completes; `null` for a partial leg. |
| `saleFinalized`    | `boolean`         | `true` when this payment settled the balance.                |
| `remainingBalance` | `number`          | Balance still due, minor units.                              |
| `timestamp`        | `string`          | ISO date string.                                             |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Order already paid on the website: record it and send it to the kitchen
await command.recordExternalPayment({ label: 'Paid online', checkoutFulfillmentTarget: 'pending' });

// Deposit paid online, balance in cash later
const { remainingBalance } = await command.recordExternalPayment({ label: 'Online deposit', amount: 1000 });
await command.cashPayment({ amount: remainingBalance });
```

## Error Handling

Throws when `label` is missing or empty, `amount` is negative or exceeds the balance due, `checkoutFulfillmentTarget` isn't a valid fulfillment state, or the cart is empty.

## Notes

- Recorded as payment type `external` with the label as its name. It is **not** a `custom` payment: the Custom Payments extension (and its per-transaction fee) is a separate, unrelated tender.
- Refunding an external payment records the refund under the same label — no device is involved; returning the money is done wherever it was taken.

## Events

- `payments` / `payment-done` when the payment completes the sale, like every other tender.
