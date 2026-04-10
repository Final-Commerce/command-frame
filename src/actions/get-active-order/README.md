# getActiveOrder

Retrieves the currently active order from the POS session. The active order is typically set via [`setActiveOrder`](../set-active-order/README.md) and is used for operations like printing receipts, processing refunds, or viewing order details.

## Parameters

None.

## Response

`Promise<GetActiveOrderResponse>`

| Field       | Type      | Description                               |
| :---------- | :-------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the active order was retrieved successfully. |
| `order`     | [`CFActiveOrder`](../../types/README.md#cfactiveorder) ` \| null` | The currently active order, or `null` if no order is active. |
| `timestamp` | `string`  | ISO date string of when the action occurred. |

**Tip:** You can import the [`CFActiveOrder`](../../types/README.md#cfactiveorder) type directly from the library:
```typescript
import { type CFActiveOrder } from '@final-commerce/command-frame';
```

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  const result = await command.getActiveOrder();

  if (result.order) {
    console.log('Active order ID:', result.order._id);
    console.log('Receipt ID:', result.order.receiptId);
    console.log('Status:', result.order.status);
    console.log('Line items:', result.order.lineItems);
  } else {
    console.log('No active order');
  }

  // Expected output:
  // {
  //   success: true,
  //   order: {
  //     _id: "order-123",
  //     receiptId: "R-001",
  //     status: "completed",
  //     lineItems: [...],
  //     ...
  //   },
  //   timestamp: "2024-01-15T10:00:00.000Z"
  // }

} catch (error) {
  console.error('Failed to get active order:', error);
}
```

### Use with setActiveOrder

Set an order as active and then retrieve it:

```typescript
import { command } from '@final-commerce/command-frame';

await command.setActiveOrder({ orderId: 'order-123' });

const { order } = await command.getActiveOrder();
console.log('Active order:', order);
```

### Check before refund operations

Verify an active order exists before initiating a refund:

```typescript
import { command } from '@final-commerce/command-frame';

const { order } = await command.getActiveOrder();

if (!order) {
  throw new Error('No active order to refund');
}

await command.initiateRefund({ orderId: order._id });
```

## Error Handling

```typescript
try {
  const result = await command.getActiveOrder();
  if (!result.order) {
    console.log('No order is currently active');
  }
} catch (error) {
  console.error('Failed to retrieve active order:', error);
}
```

## Notes

- Returns `null` for the `order` field when no order has been set as active.
- The active order is typically set using [`setActiveOrder`](../set-active-order/README.md).
- Useful for checking the current order context before performing order-specific operations (refunds, reprints, etc.).
- The returned order includes all fields from [`CFActiveOrder`](../../types/README.md#cfactiveorder), which extends [`CFOrder`](../../types/README.md#cforder) with runtime POS session fields (`user`, `outlet`, `station`, etc.).
