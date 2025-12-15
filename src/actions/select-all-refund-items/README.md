# selectAllRefundItems

Selects all remaining refundable items (line items, custom sales, cart fees, and tips) for a full refund.

## Parameters

### `SelectAllRefundItemsParams`

```typescript
interface SelectAllRefundItemsParams {
    orderId?: string; // Optional, set specific order as active before selecting
}
```

#### `orderId` (optional)

The ID of the order to select items from. If provided, the system will first set this order as the active order. If not provided, it will attempt to use the currently active order (if any).

## Response

`Promise<SelectAllRefundItemsResponse>`

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | `true` if all items were selected successfully. |
| `selectedItemsCount` | `number` | The number of items selected (line items + custom sales). |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Select all refundable items for a specific order
  const result = await command.selectAllRefundItems({
      orderId: 'order-123'
  });
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

- Throws an error if `orderId` is invalid (order not found).
- Throws an error if no order is selected/active (and no `orderId` provided).

```typescript
// Example of error when order not found
try {
  await command.selectAllRefundItems({ orderId: 'invalid' });
} catch (error) {
  console.error(error.message); // "Order with ID invalid not found"
}
```

## Notes

- This command selects the maximum remaining refundable quantity for each item.
- Cart fees and tips are selected if they exist (value of 1).
- This is useful for creating a full refund of all remaining items.
