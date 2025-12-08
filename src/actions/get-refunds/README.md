# getRefunds

Retrieves a list of refunds from the system with optional filtering, sorting, and pagination.

## Parameters

`params?: GetRefundsParams`

| Parameter       | Type     | Required | Description                                                              |
| :-------------- | :------- | :------- | :----------------------------------------------------------------------- |
| `orderId`       | `string` | `false`  | Filter refunds by order ID.                                              |
| `sessionId`     | `string` | `false`  | Filter refunds by session ID.                                            |
| `outletId`      | `string` | `false`  | Filter refunds by outlet ID.                                             |
| `limit`         | `number` | `false`  | Maximum number of refunds to return (default: 50).                       |
| `offset`        | `number` | `false`  | Number of refunds to skip for pagination (default: 0).                   |
| `sortBy`        | `string` | `false`  | Field to sort by (e.g., 'createdAt'). Default: 'createdAt'.             |
| `sortDirection` | `'asc' \| 'desc'` | `false`  | Sort direction. Default: 'desc'.                                |

## Response

`Promise<GetRefundsResponse>`

| Field       | Type      | Description                               |
| :---------- | :-------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the refunds were retrieved successfully. |
| `refunds`   | `any[]`   | Array of refund objects.                  |
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

- Throws an error if there's an issue querying the database.

```typescript
// Example of error handling
try {
  await command.getRefunds({ limit: 10 });
} catch (error) {
  console.error(error.message); // "Failed to fetch refunds: ..."
}
```

## Refund Object Structure

Each refund in the `refunds` array contains:
- `_id`: Refund ID
- `orderId`: Associated order ID
- `sessionId`: Session ID
- `outletId`: Outlet ID
- `receiptId`: Receipt identifier
- `refundedBy`: User ID who processed the refund
- `reason`: Reason for refund (if provided)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `lineItems`: Array of refunded line items
- `customSales`: Array of refunded custom sales
- `cartFees`: Array of refunded cart fees
- `tips`: Array of refunded tips
- `summary`: Refund summary information
- `refundPayment`: Payment refund details
- And more fields depending on the refund

