# tapToPayPayment

Initiates a tap-to-pay payment for the current cart.

## Parameters

`params?: TapToPayPaymentParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `amount`  | `number` | `true`   | Required, integer minor units; below the balance due → partial payment (fixed split leg); above → error. |

## Response

`Promise<TapToPayPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the payment was initiated successfully. |
| `amount`    | `number \| null` | The payment amount, in integer minor currency units. |
| `paymentType` | `string` | The payment type ('tapToPay').            |
| `order`     | `ActiveOrder \| null` | The created order object after payment processing. May be null if order creation is delayed. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Pay with tap to pay for the cart's balance due
  const result = await command.tapToPayPayment({
    amount: 2550 // $25.50 in minor units
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
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with tap to pay for a specific amount (partial payment if below the balance due)
  await command.tapToPayPayment({
    amount: 5000 // $50.00 in minor units
  });

} catch (error) {
  console.error('Failed to process tap to pay payment:', error);
}
```

## Notes

- The actual payment processing happens through the parent application's payment system
- Requires the cart to have items
- May request tip if tip functionality is enabled
- The order is created asynchronously after payment processing completes
- The order field may be null if payment processing is still in progress or if there's a timeout

## Error Handling

- Throws an error if the cart is empty
- May throw an error if payment processing fails
