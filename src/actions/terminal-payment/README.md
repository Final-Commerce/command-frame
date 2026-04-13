# terminalPayment

Initiates a card-present payment on the configured Stripe terminal for the current cart. The host handles reader selection, customer flow, and order creation; this command only starts that flow and returns the outcome.

## Parameters

`params?: TerminalPaymentParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `amount`  | `number` | `false`  | Payment amount. If omitted, the host uses the cart total (see `types.ts`). |
| `paymentType` | `'Bluetooth' \| 'Cloud'` | `false` | How the host reaches the terminal reader. Defaults to `'Cloud'`. |

## Response

`Promise<TerminalPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the payment was initiated successfully. |
| `amount`    | `number \| null` | The payment amount.                       |
| `paymentType` | `string` | Host-defined payment classification (not the same field as request `paymentType`). The local demo mock returns `'terminal'`. |
| `order`     | `ActiveOrder \| null` | The created order object after payment processing. May be null if order creation is delayed. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Pay with terminal using cart total
  const result = await command.terminalPayment();
  console.log('Payment processed:', result);
  console.log('Order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 25.50,
  //   paymentType: 'terminal',
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'completed',
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with terminal for a specific amount
  await command.terminalPayment({
    amount: 50.00
  });

  // Prefer Bluetooth-connected reader (when supported by the host)
  await command.terminalPayment({
    paymentType: 'Bluetooth',
  });

} catch (error) {
  console.error('Failed to process terminal payment:', error);
}
```

## Notes

- The actual payment processing happens through the parent application's payment system
- Request `paymentType` (`Bluetooth` / `Cloud`) is forwarded to the host; response `paymentType` is a separate string field on the result object (see `TerminalPaymentResponse` in `types.ts`).
- Requires the cart to have items
- May request tip if tip functionality is enabled
- The order is created asynchronously after payment processing completes
- The order field may be null if payment processing is still in progress or if there's a timeout

## Error Handling

- Throws an error if the cart is empty
- May throw an error if payment processing fails
