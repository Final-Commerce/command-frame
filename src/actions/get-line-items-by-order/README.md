# getLineItemsByOrder

Retrieves line items and custom sales from an order, along with calculated remaining refundable quantities for each item.

## Parameters

`params?: GetLineItemsByOrderParams`

| Parameter | Type   | Required | Description                                                              |
| :-------- | :----- | :------- | :----------------------------------------------------------------------- |
| `orderId` | `string` | `false`  | The ID of the order to retrieve line items from. If not provided, uses the currently active order. |

## Response

`Promise<GetLineItemsByOrderResponse>`

| Field                          | Type                      | Description                               |
| :----------------------------- | :------------------------ | :---------------------------------------- |
| `success`                      | `boolean`                 | `true` if the line items were retrieved successfully. |
| `orderId`                      | `string`                  | The ID of the order.                      |
| `lineItems`                    | `LineItem[]`              | Array of line items in the order. Each line item includes a `key` field (internalId \|\| variantId \|\| productId) that should be used for refund operations. |
| `customSales`                  | `CustomSale[]`            | Array of custom sales in the order.      |
| `remainingQuantities`          | `Record<string, number>`  | Map of item keys to remaining refundable quantities. Keys match the `key` field from lineItems. |
| `remainingCustomSalesQuantities` | `Record<string, number>`  | Map of custom sale IDs to remaining refundable quantities. |
| `timestamp`                    | `string`                  | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get line items for a specific order
  const result = await command.getLineItemsByOrder({
    orderId: 'order-123'
  });
  console.log('Line items:', result);
  
  // Each line item includes a 'key' field that should be used for refund operations
  if (result.lineItems.length > 0) {
    const firstItem = result.lineItems[0];
    console.log('Item key for refund operations:', firstItem.key); // Use this key for setRefundStockAction
    console.log('Remaining refundable quantity:', result.remainingQuantities[firstItem.key]);
  }
  
  // Expected output:
  // {
  //   success: true,
  //   orderId: 'order-123',
  //   lineItems: [
  //     {
  //       key: 'fe1b041c-b48a-44ac-9214-a45cd18f0dfd', // Use this for refund operations
  //       internalId: 'fe1b041c-b48a-44ac-9214-a45cd18f0dfd',
  //       variantId: '69308fb4f6f3e98279da9c6e',
  //       productId: '691df9c6c478bada1fb23d38',
  //       name: 'Final Juice',
  //       quantity: 2,
  //       ...
  //     }
  //   ],
  //   customSales: [...],
  //   remainingQuantities: { 'fe1b041c-b48a-44ac-9214-a45cd18f0dfd': 2 },
  //   remainingCustomSalesQuantities: { 'custom-sale-1': 1 },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Get line items for the currently active order
  const activeOrderItems = await command.getLineItemsByOrder();
  console.log('Active order line items:', activeOrderItems);

} catch (error) {
  console.error('Failed to get line items:', error);
}
```

## Error Handling

- Throws an error if no order is active and no `orderId` is provided.
- Throws an error if the provided `orderId` is not found.

```typescript
// Example of error when no active order and no orderId
try {
  await command.getLineItemsByOrder();
} catch (error) {
  console.error(error.message); // "No active order. Please provide an orderId or set an order as active."
}
```

