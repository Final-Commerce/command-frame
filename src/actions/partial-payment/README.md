# partialPayment

Initiates a partial/split payment for the current cart.

## Parameters

`params?: PartialPaymentParams`

| Parameter  | Type      | Required | Description                                                              |
| :--------- | :-------- | :------- | :----------------------------------------------------------------------- |
| `openUI`   | `boolean` | `false`  | If true, opens the split payment UI. If false, processes the payment with the specified amount. |
| `amount`   | `number`  | `false`  | The payment amount (required if openUI is false).                        |
| `isPercent` | `boolean` | `false`  | Whether the amount is a percentage (default: false).                      |

## Response

`Promise<PartialPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the payment was processed successfully. |
| `amount`    | `number \| undefined` | The payment amount (undefined if openUI is true). |
| `isPercent` | `boolean \| undefined` | Whether the amount is a percentage (undefined if openUI is true). |
| `openUI`    | `boolean` | Whether the split payment UI was opened. |
| `order`     | `ActiveOrder \| null` | The created order object after payment processing. May be null for split payments until the final payment completes the order. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { commands } from '@final-commerce/command-frame';

try {
  // Open the split payment UI
  const result1 = await commands.partialPayment({
    openUI: true
  });
  console.log('Split payment UI opened:', result1);
  // order will be null until final payment completes

  // Process a partial payment with a fixed amount
  const result2 = await commands.partialPayment({
    amount: 25.00,
    isPercent: false
  });
  console.log('Partial payment processed:', result2);
  console.log('Order:', result2.order);
  // Expected output:
  // {
  //   success: true,
  //   amount: 25.00,
  //   isPercent: false,
  //   openUI: false,
  //   order: {
  //     _id: 'order-id-123',
  //     status: 'completed',
  //     ...
  //   } or null if this is not the final payment,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Process a partial payment with a percentage
  await commands.partialPayment({
    amount: 50,
    isPercent: true
  });

} catch (error) {
  console.error('Failed to process partial payment:', error);
}
```

## Notes

- The cart must have items
- For split payments, the order is only created when the final payment completes the total
- If `openUI` is true, the order will be null as the payment is processed through the UI
- The order field may be null for partial payments until all payments are complete

## Error Handling

- Throws an error if the cart is empty
- Throws an error if amount is missing when openUI is false
