# processPartialRefund

Processes a partial refund based on the current refund selections in the refund details state.

## Parameters

`params?: ProcessPartialRefundParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `reason`  | `string` | `false`  | Optional reason for the refund.                                         |

## Response

`Promise<ProcessPartialRefundResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the refund processing was initiated successfully. |
| `refundId`  | `string` | The ID of the created refund (may be 'pending' initially). |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // First, select items to refund (e.g., using selectAllRefundItems or other refund selection methods)
  await command.selectAllRefundItems();

  // Process the partial refund
  const result = await command.processPartialRefund({
    reason: 'Customer requested return'
  });
  console.log('Refund processed:', result);
  // Expected output:
  // {
  //   success: true,
  //   refundId: 'refund-id-456',
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to process refund:', error);
}
```

## Error Handling

- Throws an error if no order is currently active.
- Throws an error if no refund details exist.
- Throws an error if no items are selected for refund.

```typescript
// Example of error when no items selected
try {
  await command.processPartialRefund();
} catch (error) {
  console.error(error.message); // "No items selected for refund. Please select items to refund first."
}
```

## Notes

- This command processes the refund asynchronously through the refund handler system.
- The refund is created in the database and the order status is updated accordingly.
- Payment refunds are processed based on the original payment methods.
- Stock actions (restock/damage) are applied based on the refund details options.

