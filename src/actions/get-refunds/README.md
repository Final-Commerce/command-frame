# getRefunds

Retrieves a list of refunds from the system with optional filtering, sorting, and pagination.

## Parameters

`params?: GetRefundsParams`

| Parameter       | Type     | Required | Description                                                              |
| :-------------- | :------- | :------- | :----------------------------------------------------------------------- |
| `orderId`       | `string` | `false`  | Filter refunds by order ID.                                              |
| `sessionId`     | `string` | `false`  | Filter refunds by session ID.                                            |
| `outletId`      | `string` | `false`  | Filter refunds by outlet ID.                                             |
| `limit`         | `number` | `false`  | Maximum number of refunds to return. If omitted, all refunds matching the query are returned (no default limit). |
| `offset`        | `number` | `false`  | Number of refunds to skip for pagination (default: 0).                   |
| `sortBy`        | `string` | `false`  | Field to sort by (e.g., 'createdAt'). Default: 'createdAt'.             |
| `sortDirection` | `'asc' \| 'desc'` | `false`  | Sort direction. Default: 'desc'.                                |

## Response

`Promise<GetRefundsResponse>`

| Field       | Type      | Description                               |
| :---------- | :-------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the refunds were retrieved successfully. |
| `refunds`   | [`CFRefundItem`](../../types/README.md#cfrefunditem)`[]`   | Array of refund objects.                  |
| `total`     | `number`  | Total number of refunds matching the query. |
| `timestamp` | `string`  | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get all refunds
  const allRefunds = await command.getRefunds({
    limit: 20,
    offset: 0
  });
  console.log('All refunds:', allRefunds);
  // Expected output:
  // {
  //   success: true,
  //   refunds: [...],
  //   total: 50,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Get refunds for a specific order
  const orderRefunds = await command.getRefunds({
    orderId: 'order-123'
  });
  console.log('Order refunds:', orderRefunds);

  // Get refunds for a specific session
  const sessionRefunds = await command.getRefunds({
    sessionId: 'session-456',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  console.log('Session refunds:', sessionRefunds);

  // Get refunds for a specific outlet
  const outletRefunds = await command.getRefunds({
    outletId: 'outlet-789',
    limit: 10
  });
  console.log('Outlet refunds:', outletRefunds);

} catch (error) {
  console.error('Failed to get refunds:', error);
}
```

## Error Handling

- If `orderId` is provided, it must reference an existing order — an unknown `orderId` throws `Order with ID {orderId} not found`. (`sessionId` and `outletId` are not validated the same way; an unmatched value just yields an empty/filtered result.)
- Underlying database/sync errors propagate as-is (not wrapped in a custom message).

```typescript
// Example of error handling
try {
  await command.getRefunds({ orderId: 'does-not-exist' });
} catch (error) {
  console.error(error.message); // "Order with ID does-not-exist not found"
}
```

## Refund Object Structure

Each refund in the `refunds` array contains:
- `lineItems`: Array of refunded line items
- `customSales`: Array of refunded custom sales
- `cartFees`: Array of refunded cart fees
- `tips`: Array of refunded tips
- `refundedBy`: User ID who processed the refund
- `timestamp`: ISO date string of when the refund occurred (may be `undefined`)
- `summary`: Refund summary information (optional)
- `refundPayment`: Payment refund details
- `balance`: Remaining balance after the refund (optional)
- `receiptId`: Receipt identifier (optional)
- `currency`: Currency code for the refund (optional)
- `minorUnits`: Minor unit precision for the currency (optional)

