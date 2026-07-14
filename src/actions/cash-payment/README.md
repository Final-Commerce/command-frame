# cashPayment

Pays (part of) the current cart with cash. All amounts are **integer MINOR
currency units** (e.g. `1575` = $15.75 — see `getContext().minorUnits`).

The flow owns the tender UI: preview the cash-rounded total with
[`getCashRoundingAmount`](../get-cash-rounding-amount/README.md), collect the
cash from the customer, and pass it as `tenderedAmount` — the response's
`change` tells you what to hand back (it accounts for cash rounding).

## Parameters

`params: CashPaymentParams`

| Parameter              | Type      | Required | Description                                                              |
| :--------------------- | :-------- | :------- | :----------------------------------------------------------------------- |
| `amount`               | `number`  | `true`   | Amount to pay with this tender (minor units). Less than the balance due → partial payment (fixed split leg). Equal → full payment. More → error. |
| `tenderedAmount`       | `number`  | `false`  | Cash handed over by the customer (minor units). Must cover the (cash-rounded) charge; the POS computes `change` and skips its own modal. |
| `openChangeCalculator` | `boolean` | `false`  | **@deprecated** — legacy POS-owned change calculator. Use `tenderedAmount` instead. |
| `checkoutFulfillmentTarget` | `string` | `false` | Override the fulfillment state after full payment. |

## Response

`Promise<CashPaymentResponse>`

| Field                | Type     | Description                               |
| :------------------- | :------- | :---------------------------------------- |
| `success`            | `boolean` | `true` if the payment was processed.      |
| `amount`             | `number`  | The amount paid with this tender (minor units). |
| `change`             | `number`  | Change due back (minor units). Display this — it accounts for cash rounding. |
| `tenderedAmount`     | `number?` | Echo of the tendered cash when provided.  |
| `cashRounding`       | `number`  | Signed rounding delta applied to the charge (minor units); `0` without a setting. |
| `openChangeCalculator` | `boolean` | **@deprecated** mirror of the request flag. |
| `paymentType`        | `string`  | `'cash'`.                                 |
| `order`              | `ActiveOrder \| null` | The created/updated order. Null on a partial leg that didn't complete the sale. |
| `timestamp`          | `string`  | ISO date string.                          |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Preview the cash-rounded total for the cart:
const { roundedAmount } = await command.getCashRoundingAmount();

// 2. Collect cash in YOUR UI, then pay:
const result = await command.cashPayment({
  amount: roundedAmount, // minor units; or the cart balance — the POS rounds either way
  tenderedAmount: 2000,  // $20.00 handed over
});
console.log(`Change due (minor units): ${result.change}`);

// Partial payment: pay $10.00 of a larger balance (enters split-payment mode):
await command.cashPayment({ amount: 1000, tenderedAmount: 1000 });
```

## Notes

- Requires the cart to have items.
- `amount` is required. An amount below the balance due automatically enters a
  fixed split-payment leg — no separate `partialPayment` call needed.
- With `tenderedAmount` the POS never opens its own change UI; without it (and
  without the deprecated flag) cash is taken as exact tender.
- Insufficient `tenderedAmount` (below the rounded charge) fails the payment.

## Error Handling

- Throws if the cart is empty, `amount` is missing, `amount` exceeds the
  balance due, or `tenderedAmount` is below the (rounded) charge.
