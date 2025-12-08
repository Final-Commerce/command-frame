# getRemainingRefundableQuantities

Gets the remaining refundable quantities for all line items and custom sales in the active order.

## Parameters

None.

## Response

`Promise<GetRemainingRefundableQuantitiesResponse>`

| Field        | Type                      | Description                               |
| :----------- | :------------------------ | :---------------------------------------- |
| `success`    | `boolean`                 | `true` if the quantities were retrieved successfully. |
| `lineItems`  | `Record<string, number>`  | Map of item keys to remaining refundable quantities. |
| `customSales` | `Record<string, number>` | Map of custom sale IDs to remaining refundable quantities. |
| `timestamp`  | `string`                  | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get remaining refundable quantities
  const result = await command.getRemainingRefundableQuantities();
  console.log('Remaining quantities:', result);
  // Expected output:
  // {
  //   success: true,
  //   lineItems: { 'variant-id-1': 3, 'variant-id-2': 0 },
  //   customSales: { 'custom-sale-1': 1 },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to get remaining quantities:', error);
}
```

## Error Handling

- Throws an error if no order is currently active.

```typescript
// Example of error when no active order
try {
  await command.getRemainingRefundableQuantities();
} catch (error) {
  console.error(error.message); // "No active order. Please set an order as active first."
}
```

## Notes

- Quantities are calculated based on original order quantities minus any previously refunded quantities.
- A quantity of 0 means the item has been fully refunded and cannot be refunded again.

