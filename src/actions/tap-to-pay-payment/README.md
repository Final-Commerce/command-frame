# tapToPayPayment

Initiates a tap-to-pay payment for the current cart.

## Parameters

`params?: TapToPayPaymentParams`

| Parameter                   | Type     | Required | Description                                                                                                                                     |
| :-------------------------- | :------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`                    | `number` | `true`\* | Integer minor units; below the balance due → partial payment (fixed split leg); equal → full payment; above → error.                            |
| `checkoutFulfillmentTarget` | `string` | `false`  | Override the fulfillment state after full payment. Must be a valid fulfillment state — an invalid value throws before the payment is attempted. |

\* Optional (and may be `0`) when the cart already nets to a `$0` balance due (e.g. fully discounted) — a negative `amount` is still rejected in that case.

## Response

`Promise<TapToPayPaymentResponse>`

| Field              | Type                  | Description                                                                                                       |
| :----------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `success`          | `boolean`             | Always `true` — a failed payment rejects the promise instead of resolving `false` (see Error Handling).           |
| `amount`           | `number`              | The amount charged for this tender, in integer minor currency units.                                              |
| `paymentType`      | `string`              | The payment type ('tapToPay').                                                                                    |
| `order`            | `ActiveOrder \| null` | The created/updated order. `null` on a partial leg that didn't complete the sale.                                 |
| `change`           | `number`              | Always `0` for tap-to-pay (change/cash-rounding only apply to cash tenders).                                      |
| `cashRounding`     | `number`              | Always `0` for tap-to-pay (cash-only).                                                                            |
| `saleFinalized`    | `boolean`             | `true` only when this tender fully completed the sale (the only or final leg); `false` on a still-open split leg. |
| `remainingBalance` | `number`              | Balance still due after this tender (minor units); `0` once the sale is finalized.                                |
| `timestamp`        | `string`              | ISO date string of when the action occurred.                                                                      |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Pay with tap to pay for the cart's balance due
  const result = await command.tapToPayPayment({
    amount: 2550, // $25.50 in minor units
  });
  console.log('Payment processed:', result);
  console.log('Order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 2550,
  //   paymentType: 'tapToPay',
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'completed',
  //     ...
  //   },
  //   change: 0,
  //   cashRounding: 0,
  //   saleFinalized: true,
  //   remainingBalance: 0,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with tap to pay for a specific amount (partial payment if below the balance due)
  await command.tapToPayPayment({
    amount: 5000, // $50.00 in minor units
  });
} catch (error) {
  console.error('Failed to process tap to pay payment:', error);
}
```

## Notes

- Requires the cart to have items.
- `amount` is required and must be a positive integer whenever the balance due is greater than `$0`. An amount below the balance due automatically enters a fixed split-payment leg — no separate `partialPayment` call needed.
- On a cart that already nets to a `$0` balance due (fully discounted), `amount` is optional and treated as `0`; no split leg is entered.
- May request tip if tip functionality is enabled.
- Payment runs through the in-process pay engine and resolves with the order already created/updated — it is not created asynchronously after the call returns.
- `order` is `null` only for a non-final split-payment leg (the sale isn't complete yet), not because of a delay or timeout.

## Events

- Publishes a `payment-done` event on the `payments` topic when this tender fully completes the sale (`saleFinalized: true` — a single-tender payment or the final leg of a split): `{ payment, order, amount }`, where `payment` is the order's last captured payment-method entry, `order` is the completed order, and `amount` is that payment's captured amount as a string (minor units). Not published for a mid-flight split leg.

## Error Handling

Every failure below **rejects the returned promise** — the handler never resolves with `success: false`.

- Cart is empty.
- `amount` is missing, not a positive integer, or exceeds the balance due (on a cart that already nets to a `$0` balance, `amount` is optional but a negative value still throws).
- `checkoutFulfillmentTarget` is set to a value that isn't a valid fulfillment state.
- The payment attempt is cancelled — surfaces as a rejection rather than a `success: false` response.
