# processPartialRefund

Processes a partial refund based on the current refund selections in the refund details state.

## Parameters

`params?: ProcessPartialRefundParams`

| Parameter | Type      | Required | Description                                                              |
| :-------- | :-------- | :------- | :----------------------------------------------------------------------- |
| `reason`  | `string`  | `false`  | Optional reason for the refund.                                         |
| `orderId` | `string`  | `false`  | Optional order to refund (sets it active first).                        |
| `items`   | `array`   | `false`  | Optional items to select for refund before processing.                 |
| `openUI`  | `boolean` | `false`  | Multi-tender only. Defaults to `true`. See "Multi-tender orders" below. |

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

## Multi-tender orders

An order paid across more than one payment method needs the refund allocated
across the original sources. By default (`openUI` omitted or `true`) this command
raises the POS split-payment refund modal so the cashier chooses the allocation,
and returns without committing — the modal drives the commit.

Flows that render their own refund UI can opt out of that modal with
`openUI: false`. The refund is then committed **headlessly** against the
planner's default proportional allocation across the original sources (every
cash-rounding invariant preserved), with no modal shown:

```typescript
// Headless multi-tender partial refund — no split-payment modal.
await command.processPartialRefund({
  orderId: 'order-123',
  items: [{ itemKey: 'line-1', quantity: 1, type: 'product' }],
  openUI: false,
});
```

`openUI` has no effect on single-tender orders (they are already headless — there
is nothing to allocate).

## Notes

- This command processes the refund asynchronously through the refund handler system.
- The refund is created in the database and the order status is updated accordingly.
- Payment refunds are processed based on the original payment methods.
- Stock actions (restock/damage) are applied based on the refund details options.
- `openUI` defaults to `true`; existing callers keep the split-payment modal behavior for multi-tender orders.

