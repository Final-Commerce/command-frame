# cashPayment

Initiates a cash payment for the current cart.

## Parameters

`params?: CashPaymentParams`

| Parameter              | Type      | Required | Description                                                              |
| :--------------------- | :-------- | :------- | :----------------------------------------------------------------------- |
| `amount`               | `number`  | `false`  | The payment amount. If not provided, uses the cart total.                |
| `openChangeCalculator` | `boolean` | `false`  | Whether to open the change calculator UI.                                |

## Response

`Promise<CashPaymentResponse>`

| Field                | Type     | Description                               |
| :------------------- | :------- | :---------------------------------------- |
| `success`            | `boolean` | `true` if the payment was initiated successfully. |
| `amount`             | `number`  | The payment amount.                       |
| `openChangeCalculator` | `boolean` | Whether the change calculator was opened. |
| `paymentType`        | `string`  | The payment type ('cash').                |
| `order`              | `ActiveOrder \| null` | The created order object after payment processing. May be null if order creation is delayed. |
| `timestamp`          | `string`  | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { commands } from '@final-commerce/command-frame';

try {
  // Pay with cash using cart total
  const result = await commands.cashPayment();
  console.log('Payment processed:', result);
  console.log('Order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 25.50,
  //   openChangeCalculator: false,
  //   paymentType: 'cash',
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'completed',
  //     lineItems: [...],
  //     summary: {...},
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Pay with cash for a specific amount with change calculator
  await commands.cashPayment({
    amount: 50.00,
    openChangeCalculator: true
  });

} catch (error) {
  console.error('Failed to process cash payment:', error);
}
```

## Notes

- Opens the cash payment UI if change calculation is enabled
- The actual payment processing happens through the parent application's payment system
- Requires the cart to have items
- The order is created asynchronously after payment processing completes
- The order field may be null if payment processing is still in progress or if there's a timeout

## Error Handling

- Throws an error if the cart is empty
- May throw an error if payment processing fails
