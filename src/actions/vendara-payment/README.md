# vendaraPayment

Initiates a Vendara payment for the current cart.

## Parameters

`params?: VendaraPaymentParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `amount`  | `number` | `false`  | The payment amount. If not provided, uses the cart total.                |

## Response

`Promise<VendaraPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the payment was initiated successfully. |
| `amount`    | `number \| null` | The payment amount.                       |
| `paymentType` | `string` | The payment type ('vendara').             |
| `order`     | `ActiveOrder \| null` | The created order object after payment processing. May be null if order creation is delayed. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { commands } from '@final-commerce/command-frame';

try {
  // Pay with Vendara using cart total
  const result = await commands.vendaraPayment();
  console.log('Payment processed:', result);
  console.log('Order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 25.50,
  //   paymentType: 'vendara',
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'completed',
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with Vendara for a specific amount
  await commands.vendaraPayment({
    amount: 50.00
  });

} catch (error) {
  console.error('Failed to process Vendara payment:', error);
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
