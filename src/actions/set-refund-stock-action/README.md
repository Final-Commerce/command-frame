# setRefundStockAction

Sets the stock handling option for a refunded line item (restock or mark as damaged).

## Parameters

`params: SetRefundStockActionParams`

| Parameter | Type                      | Required | Description                                                              |
| :-------- | :------------------------ | :------- | :----------------------------------------------------------------------- |
| `orderId` | `string`                  | `false`  | Order to target; sets it active first. Defaults to the currently active order. |
| `itemKey` | `string`                  | `true`   | Matched against the order line item's `internalId` (falling back to `variantId`). Obtainable from the order's `lineItems` (e.g. via `getActiveOrder`). |
| `action`  | `'RESTOCK' \| 'REFUND_DAMAGE'` | `true`   | The stock handling action: 'RESTOCK' to return to stock, 'REFUND_DAMAGE' to mark as damaged. **Not validated** — any other string is silently treated as 'REFUND_DAMAGE' internally, though the response still echoes back whatever value was passed. |

## Response

`Promise<SetRefundStockActionResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the stock action was set successfully. |
| `orderId`   | `string` | The `orderId` that was passed, if any (`undefined` otherwise). |
| `itemKey`   | `string` | The item key that was updated.           |
| `action`    | `string` | The action that was set.                 |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Find the item key from the active order's line items
  const { order } = await command.getActiveOrder();
  const lineItem = order?.lineItems[0];
  const itemKey = lineItem?.internalId || lineItem?.variantId;

  // Set stock action to restock
  const result = await command.setRefundStockAction({
    itemKey: itemKey,
    action: 'RESTOCK'
  });
  console.log('Stock action set:', result);
  // Expected output:
  // {
  //   success: true,
  //   itemKey: 'fe1b041c-b48a-44ac-9214-a45cd18f0dfd',
  //   action: 'RESTOCK',
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Set stock action to mark as damaged
  await command.setRefundStockAction({
    itemKey: itemKey,
    action: 'REFUND_DAMAGE'
  });

} catch (error) {
  console.error('Failed to set stock action:', error);
}
```

## Error Handling

- Throws `'itemKey and action are required'` if `itemKey` or `action` is missing.
- Throws `` `Order with ID {orderId} not found` `` if `orderId` is passed but no matching order exists.
- Throws `'No order selected. Please provide orderId.'` if no order is currently active (and `orderId` wasn't passed).
- Throws `` `Line item with key {itemKey} not found in order` `` if the item key doesn't match any line item's `internalId`/`variantId` in the order.
- `action` values other than `'RESTOCK'`/`'REFUND_DAMAGE'` do **not** throw — they are silently treated the same as `'REFUND_DAMAGE'` internally.

```typescript
// Example of the "no active order" error
try {
  await command.setRefundStockAction({
    itemKey: 'variant-id-123',
    action: 'RESTOCK'
  });
} catch (error) {
  console.error(error.message); // "No order selected. Please provide orderId."
}
```

