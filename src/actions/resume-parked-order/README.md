# resumeParkedOrder

Resumes a parked order by loading it back into the cart. The order status is updated to "in-cart".

## Parameters

`params: ResumeParkedOrderParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `orderId` | `string` | `true`   | The ID of the parked order to resume.                                   |

## Response

`Promise<ResumeParkedOrderResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the order was resumed successfully. |
| `order`     | `ActiveOrder` | The resumed order object with updated status and all details. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Resume a parked order
  const result = await command.resumeParkedOrder({
    orderId: 'order-id-123'
  });
  console.log('Resumed order:', result.order);
  // Expected output:
  // {
  //   success: true,
  //   order: {
  //     _id: 'order-id-123',
  //     receiptId: 'REC-001',
  //     status: 'in-cart',
  //     lineItems: [...],
  //     customSales: [...],
  //     summary: {...},
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to resume parked order:', error);
}
```

## Error Handling

- Throws an error if `orderId` is not provided.
- Throws an error if the order is not found.
- Throws an error if the order cannot be updated after resuming.

```typescript
// Example of error when order not found
try {
  await command.resumeParkedOrder({
    orderId: 'invalid-order-id'
  });
} catch (error) {
  console.error(error.message); // "Order with ID invalid-order-id not found"
}
```

## Notes

- The order is loaded back into the cart with all its items, discounts, fees, and customer information.
- The order status is updated from "parked" to "in-cart".
- The cart is replaced with the contents of the resumed order.
- The returned order object reflects the updated status and all order details.
