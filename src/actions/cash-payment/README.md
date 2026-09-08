# cashPayment

Pays (part of) the current cart with cash. All amounts are **integer MINOR
currency units** (e.g. `1575` = $15.75 — see `getContext().minorUnits`).

The flow owns the tender UI: preview the cash-rounded total with
[`getCashRoundingAmount`](../get-cash-rounding-amount/README.md), collect the
cash from the customer, and pass it as `tenderedAmount` — the response's
`change` tells you what to hand back (it accounts for cash rounding).

## Parameters

`params: CashPaymentParams`

| Parameter                   | Type      | Required | Description                                                                                                                                                                  |
| :-------------------------- | :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`                    | `number`  | `true`\* | Amount to pay with this tender (minor units). Must be a positive integer. Less than the balance due → partial payment (fixed split leg). Equal → full payment. More → error. |
| `tenderedAmount`            | `number`  | `false`  | Cash handed over by the customer (minor units). Must cover the (cash-rounded) charge; the POS computes `change` and skips its own modal.                                     |
| `openChangeCalculator`      | `boolean` | `false`  | **@deprecated** — legacy POS-owned change calculator. Use `tenderedAmount` instead.                                                                                          |
| `checkoutFulfillmentTarget` | `string`  | `false`  | Override the fulfillment state after full payment. Must be a valid fulfillment state — an invalid value throws before the payment is attempted.                              |

\* Optional (and may be `0`) when the cart already nets to a `$0` balance due
(e.g. fully discounted) — a negative `amount` is still rejected in that case.

## Response

`Promise<CashPaymentResponse>`

| Field                  | Type                  | Description                                                                                                       |
| :--------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `success`              | `boolean`             | Always `true` — a failed payment rejects the promise instead of resolving `false` (see Error Handling).           |
| `amount`               | `number`              | The amount paid with this tender (minor units).                                                                   |
| `change`               | `number`              | Change due back (minor units). Display this — it accounts for cash rounding.                                      |
| `tenderedAmount`       | `number?`             | Echo of the tendered cash when provided.                                                                          |
| `cashRounding`         | `number`              | Signed rounding delta applied to the charge (minor units); `0` without a setting.                                 |
| `openChangeCalculator` | `boolean`             | **@deprecated** mirror of the request flag.                                                                       |
| `paymentType`          | `string`              | `'cash'`.                                                                                                         |
| `order`                | `ActiveOrder \| null` | The created/updated order. Null on a partial leg that didn't complete the sale.                                   |
| `saleFinalized`        | `boolean`             | `true` only when this tender fully completed the sale (the only or final leg); `false` on a still-open split leg. |
| `remainingBalance`     | `number`              | Balance still due after this tender (minor units); `0` once the sale is finalized.                                |
| `timestamp`            | `string`              | ISO date string.                                                                                                  |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Preview the cash-rounded total for the cart:
const { roundedAmount } = await command.getCashRoundingAmount();

// 2. Collect cash in YOUR UI, then pay:
const result = await command.cashPayment({
  amount: roundedAmount, // minor units; or the cart balance — the POS rounds either way
  tenderedAmount: 2000, // $20.00 handed over
});
console.log(`Change due (minor units): ${result.change}`);

// Partial payment: pay $10.00 of a larger balance (enters split-payment mode):
await command.cashPayment({ amount: 1000, tenderedAmount: 1000 });
```

## Notes

- Requires the cart to have items.
- `amount` is required and must be a positive integer whenever the balance due
  is greater than `$0`. An amount below the balance due automatically enters a
  fixed split-payment leg — no separate `partialPayment` call needed.
- On a cart that already nets to a `$0` balance due (fully discounted),
  `amount` is optional and treated as `0`; no split leg is entered.
- With `tenderedAmount` the POS never opens its own change UI; without it (and
  without the deprecated flag) cash is taken as exact tender.
- Insufficient `tenderedAmount` (below the rounded charge) fails the payment.
- If the deprecated change-calculator modal is cancelled, the promise resolves
  normally (`success: true`, `order: null`, `saleFinalized: false`) rather
  than rejecting — check `saleFinalized`/`order`, not just for a thrown error.

## Events

- Publishes a `payment-done` event on the `payments` topic when this tender
  fully completes the sale (`saleFinalized: true` — a single-tender payment or
  the final leg of a split): `{ payment, order, amount }`, where `payment` is
  the order's last captured payment-method entry, `order` is the completed
  order, and `amount` is that payment's captured amount as a string (minor
  units). Not published for a mid-flight split leg.

## Error Handling

Every failure below **rejects the returned promise** — the handler never
resolves with `success: false`.

- Cart is empty.
- `amount` is missing, not a positive integer, or exceeds the balance due (on
  a cart that already nets to a `$0` balance, `amount` is optional but a
  negative value still throws).
- `checkoutFulfillmentTarget` is set to a value that isn't a valid fulfillment
  state.
- `tenderedAmount` is below the (rounded) charge.
