# calculateRefundTotal

Calculates and returns a preview of the refund total based on current refund selections, without processing the refund.

## Parameters

None. Uses current refund details from Redux state.

## Response

`Promise<CalculateRefundTotalResponse>`

| Field              | Type     | Description                               |
| :----------------- | :------- | :---------------------------------------- |
| `success`          | `boolean` | `true` if the calculation was successful. |
| `summary`          | `object` | Summary of refund totals.                |
| `summary.subtotal` | `string` | Subtotal of refunded items.              |
| `summary.tax`      | `string` | Total tax amount.                        |
| `summary.total`    | `string` | Total refund amount.                     |
| `refundedLineItems` | `any[]` | Array of refunded line items with calculated totals. |
| `refundedCustomSales` | `any[]` | Array of refunded custom sales with calculated totals. |
| `timestamp`        | `string` | ISO date string of when the action occurred. |

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

- Throws an error if no order is currently active.
- Throws an error if no refund details exist (no items selected for refund).

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

