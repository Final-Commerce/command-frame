# selectAllRefundItems

Selects all remaining refundable items (line items, custom sales, cart fees, and tips) for a full refund.

## Parameters

None.

## Response

`Promise<SelectAllRefundItemsResponse>`

| Field               | Type     | Description                               |
| :------------------ | :------- | :---------------------------------------- |
| `success`           | `boolean` | `true` if all items were selected successfully. |
| `selectedItemsCount` | `number` | The number of items selected (line items + custom sales). |
| `timestamp`         | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { commands } from '@final-commerce/command-frame';

try {
  // Select all refundable items
  const result = await commands.selectAllRefundItems();
  console.log('All items selected:', result);
  // Expected output:
  // {
  //   success: true,
  //   selectedItemsCount: 5,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to select all items:', error);
}
```

## Error Handling

- Throws an error if no order is currently active.

```typescript
// Example of error when no active order
try {
  await commands.selectAllRefundItems();
} catch (error) {
  console.error(error.message); // "No active order. Please set an order as active first."
}
```

## Notes

- This command selects the maximum remaining refundable quantity for each item.
- Cart fees and tips are selected if they exist (value of 1).
- This is useful for creating a full refund of all remaining items.

