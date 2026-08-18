# terminalPayment

Initiates a terminal payment for the current cart.

## Parameters

`params?: TerminalPaymentParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `amount`  | `number` | `true`   | Required, integer minor units; below the balance due → partial payment (fixed split leg); above → error. |
| `paymentType` | `"Bluetooth" \| "Cloud"` | `false` | Selects the terminal route. Omitted, or `"Bluetooth"`, routes to the native device-bridge reader (physical terminal). `"Cloud"` routes to the cloud/HTTP terminal processor instead — the handler only switches processors when the value is explicitly `"Cloud"`. |
| `checkoutFulfillmentTarget` | `string` | `false` | Overrides the fulfillment state the order lands in on full payment (validated against the fulfillment state machine; invalid values throw — see Error Handling). Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. |

## Response

`Promise<TerminalPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | Always `true` — a failed payment rejects the promise instead of resolving `false` (see Error Handling). |
| `amount`    | `number \| null` | The payment amount, in integer minor currency units. |
| `paymentType` | `string` | The payment type ('terminal').            |
| `order`     | `ActiveOrder \| null` | The order after payment processing. `null` on a non-final split-payment leg — only the leg that finalizes the sale returns the order. |
| `change`    | `number` | Cash change due back, integer minor units. Always `0` for terminal payments (no cash tender). |
| `cashRounding` | `number` | Signed cash-rounding delta, integer minor units. Always `0` for terminal payments (rounding only applies to cash legs). |
| `saleFinalized` | `boolean` | `true` only when this leg finalized the sale (the last, or only, leg captured). |
| `remainingBalance` | `number` | Balance still due after this leg, integer minor units; `0` when finalized. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Pay with terminal for the cart's balance due
  const result = await command.terminalPayment({
    amount: 2550 // $25.50 in minor units
  });
  console.log('Payment processed:', result);
  console.log('Order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 2550,
  //   paymentType: 'terminal',
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'completed',
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with terminal for a specific amount (partial payment if below the balance due)
  await command.terminalPayment({
    amount: 5000 // $50.00 in minor units
  });

} catch (error) {
  console.error('Failed to process terminal payment:', error);
}
```

## Notes

- The actual payment processing happens through the parent application's payment system
- Requires the cart to have items
- May request tip if tip functionality is enabled
- `terminalPayment` awaits the payment engine directly and returns its result in the same call — the order is not created asynchronously in the background, and there is no timeout-driven null
- `order` is `null` specifically when this tender is a non-final leg of a split payment (the sale isn't complete yet); the leg that finalizes the sale returns the order

## Events

- Publishes a `payment-done` event on the `payments` topic when this tender fully completes the sale (`saleFinalized: true` — a single-tender payment or the final leg of a split): `{ payment, order, amount }`, where `payment` is the order's last captured payment-method entry, `order` is the completed order, and `amount` is that payment's captured amount as a string (minor units). Not published for a mid-flight split leg.

## Error Handling

Every failure below **rejects the returned promise** — the handler never resolves with `success: false`.

- Cart is empty: throws `Cart is empty. Cannot process payment.`
- Missing `amount` (on a cart with a balance due greater than `$0`): throws `terminalPayment: amount is required (integer minor currency units)`.
- `amount` is not a positive integer (on a cart with a balance due greater than `$0`): throws `terminalPayment: amount must be a positive integer (minor units)`.
- `amount` is negative (on a cart with a balance due of exactly `$0`): throws `terminalPayment: amount must not be negative (minor units)`.
- `amount` exceeds the balance due: throws `terminalPayment: amount {amount} exceeds the balance due {balanceDue}`.
- An invalid `checkoutFulfillmentTarget` throws `terminalPayment: invalid checkoutFulfillmentTarget "<value>"`.
- A cancelled payment (e.g. a dismissed modal mid-flow) surfaces as `Payment cancelled` rather than the underlying error.
