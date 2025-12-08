# parkOrder

Parks (saves) the current order for later retrieval. The cart is cleared after parking.

## Parameters

None

## Response

`Promise<ParkOrderResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the order was parked successfully. |
| `order`     | `ActiveOrder` | The parked order object with all details. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Park the current order
const result = await command.parkOrder();
console.log('Parked order:', result.order);
// Expected output:
// {
//   success: true,
//   order: {
//     _id: 'order-id-123',
//     receiptId: 'REC-001',
//     status: 'parked',
//     lineItems: [...],
//     customSales: [...],
//     summary: {...},
//     ...
//   },
//   timestamp: '2023-10-27T10:00:00.000Z'
// }
```

## Notes

- The cart is automatically cleared after parking the order
- Parked orders can be retrieved using `resumeParkedOrder`
- Parked orders can be deleted using `deleteParkedOrder`
- The returned order object includes all order details including line items, custom sales, totals, customer, and payment information

## Error Handling

- Throws an error if no active station is found
- Throws an error if the order cannot be created
- Throws an error if the order cannot be saved to the database
