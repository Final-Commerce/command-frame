# calculateRefundTotal

Calculates and returns a preview of the refund total based on current refund selections, without processing the refund.

## Parameters

| Field     | Type     | Required | Description                                                                                                    |
| :-------- | :------- | :------- | :--------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string` | No       | Order ID to load and set as the active order before calculating. When omitted, the currently active order in Redux state is used. |

Refund selections (which items/fees/tips to refund) always come from the current `refundDetails` in Redux state — `orderId` only controls which order those selections are calculated against.

## Response

`Promise<CalculateRefundTotalResponse>`

| Field              | Type     | Description                               |
| :----------------- | :------- | :---------------------------------------- |
| `success`          | `boolean` | Always `true`; a failed calculation throws instead of resolving. |
| `summary`          | `object` | Summary of refund totals.                |
| `summary.subtotal` | `string` | Subtotal of refunded items.              |
| `summary.tax`      | `string` | Total tax amount.                        |
| `summary.total`    | `string` | Total refund amount.                     |
| `refundedLineItems` | `any[]` | Array of refunded line items with calculated totals. |
| `refundedCustomSales` | `any[]` | Array of refunded custom sales with calculated totals. |
| `timestamp`        | `string` | ISO date string of when the action occurred. |

> **⚠️ Encoding caveat**: unlike everywhere else on this API (integer minor units), the `summary.subtotal` / `summary.tax` / `summary.total` values are **decimal display strings** (e.g. `'22.60'`), while `refundedLineItems[].total` / `totalTax` in the *same response* remain integer minor-unit numbers. Never feed `summary` values into money params (`processPartialRefund`, `redeemRefund`, …) without converting. Aligning `summary` to minor units is planned as a future breaking change.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // First, select items to refund (e.g., using selectAllRefundItems or other refund selection methods)
  await command.selectAllRefundItems();

  // Calculate the refund total
  const result = await command.calculateRefundTotal();
  console.log('Refund total:', result);
  // Expected output:
  // {
  //   success: true,
  //   summary: {
  //     subtotal: '20.00',
  //     tax: '2.60',
  //     total: '22.60'
  //   },
  //   refundedLineItems: [...],
  //   refundedCustomSales: [...],
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to calculate refund total:', error);
}
```

## Error Handling

- Throws an error if `orderId` is provided but no matching order is found: `"Order with ID {orderId} not found"`.
- Throws an error if no order is currently active and no `orderId` was provided: `"No order selected. Please provide orderId."`
- Throws an error if `refundDetails` is missing entirely from state (e.g. no refund flow has been started, so `setActiveRefund` was never called). It does **not** throw once `refundDetails` exists but has no items/fees/tips selected (e.g. right after `setActiveRefund`) — in that case the calculation still succeeds, returning all-zero totals.

```typescript
// Example of error when no refund details
try {
  await command.calculateRefundTotal();
} catch (error) {
  console.error(error.message); // "No refund details. Please select items to refund first."
}
```

## Notes

- This is a preview calculation and does not process the refund.
- Calculations include taxes, discounts, fees, and tips proportionally.
- Tax calculations respect tax-inclusive vs tax-exclusive settings.

