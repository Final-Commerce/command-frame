# getRemainingRefundableQuantities

Gets the remaining refundable quantities for all line items, custom sales, cart fees, and tips in the active order.

## Parameters

| Field     | Type     | Required | Description                                                                                                                                                                 |
| :-------- | :------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string` | No       | ID of an order to check. If provided, that order is looked up and set as the active order before quantities are calculated. If omitted, the currently active order is used. |

## Response

`Promise<GetRemainingRefundableQuantitiesResponse>`

| Field         | Type                     | Description                                                                                                                                                                                                   |
| :------------ | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `success`     | `boolean`                | `true` if the quantities were retrieved successfully.                                                                                                                                                         |
| `lineItems`   | `Record<string, number>` | Map of item keys to remaining refundable quantities.                                                                                                                                                          |
| `customSales` | `Record<string, number>` | Map of custom sale IDs to remaining refundable quantities.                                                                                                                                                    |
| `cartFees`    | `Record<string, number>` | Map of cart fee IDs (`order.cartFees[].id`) to remaining refundable quantity — 0/1 semantics (`1` = still refundable, `0` = already refunded). Same key `processPartialRefund` takes for `type: 'fee'` items. |
| `tips`        | `Record<string, number>` | Map of tip-paying `transactionId`s to remaining refundable quantity — 0/1 semantics. Only payment methods that carry a tip appear. Same key `processPartialRefund` takes for `type: 'tip'` items.             |
| `timestamp`   | `string`                 | ISO date string of when the action occurred.                                                                                                                                                                  |

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
  //   cartFees: { 'fee-1': 1, 'fee-2': 0 },
  //   tips: { 'txn-abc': 1 },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }
} catch (error) {
  console.error('Failed to get remaining quantities:', error);
}
```

## Error Handling

- Throws an error if `orderId` is provided but no matching order is found: `Order with ID {orderId} not found`
- Throws an error if no order is active and no `orderId` was provided.

```typescript
// Example of error when no active order
try {
  await command.getRemainingRefundableQuantities();
} catch (error) {
  console.error(error.message); // "No order selected. Please provide orderId."
}
```

## Notes

- Quantities are calculated based on original order quantities minus any previously refunded quantities.
- Cart fees and tips are single-shot refundables: their remaining quantity is `1` until they appear in a persisted refund's `cartFees`/`tips`, then `0`. Feed these maps straight into `processPartialRefund` `items` rows (`type: 'fee'` with the fee id, `type: 'tip'` with the transactionId) — the keys match by design.
- A quantity of 0 means the item has been fully refunded and cannot be refunded again.
