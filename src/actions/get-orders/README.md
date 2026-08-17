# getOrders

Retrieves a list of orders from the system with optional filtering, sorting, and pagination.

## Parameters

`params?: GetOrdersParams`

| Parameter       | Type     | Required | Description                                                              |
| :-------------- | :------- | :------- | :----------------------------------------------------------------------- |
| `status`        | `string` | `false`  | Filter by order status (e.g., 'completed', 'parked', 'refunded', 'partial-refund'). Passing `'all'` (or omitting the parameter) skips the status filter and returns orders of every status. |
| `customerId`    | `string` | `false`  | Filter orders by customer ID.                                            |
| `sessionId`     | `string` | `false`  | Filter orders by session ID.                                             |
| `limit`         | `number` | `false`  | Maximum number of orders to return (default: 50).                        |
| `offset`        | `number` | `false`  | Number of orders to skip for pagination (default: 0).                    |
| `searchValue`   | `string` | `false`  | Search term to filter orders.                                            |
| `sortBy`        | `string` | `false`  | Top-level order field to sort by (e.g., 'createdAt', 'receiptId', 'status'). Only top-level fields are supported — nested fields such as the order total (`summary.total`) can't be sorted by, since `'total'` isn't a field on the order itself. Default: 'createdAt'. |
| `sortDirection` | `'ascending' \| 'descending'` | `false`  | Sort direction. Default: 'descending'.                    |

## Response

`Promise<GetOrdersResponse>`

| Field       | Type      | Description                               |
| :---------- | :-------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the orders were retrieved successfully. |
| `orders`    | [`CFOrder`](../../types/README.md#cforder)`[]` | Array of order objects.                   |

**Tip:** You can import the [`CFOrder`](../../types/README.md#cforder) type directly from the library:
```typescript
import { type CFOrder } from '@final-commerce/command-frame';
```

| `total`     | `number`  | Total number of orders matching the query. |
| `timestamp` | `string`  | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get all completed orders
  const completedOrders = await command.getOrders({
    status: 'completed',
    limit: 20,
    offset: 0
  });
  console.log('Completed orders:', completedOrders);
  // Expected output:
  // {
  //   success: true,
  //   orders: [...],
  //   total: 150,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

  // Get orders for a specific customer
  const customerOrders = await command.getOrders({
    customerId: 'customer-123',
    sortBy: 'createdAt',
    sortDirection: 'descending'
  });
  console.log('Customer orders:', customerOrders);

  // Get parked orders
  const parkedOrders = await command.getOrders({
    status: 'parked',
    limit: 10
  });
  console.log('Parked orders:', parkedOrders);

  // Search orders
  const searchResults = await command.getOrders({
    searchValue: 'John Doe',
    limit: 10
  });
  console.log('Search results:', searchResults);

} catch (error) {
  console.error('Failed to get orders:', error);
}
```

## Error Handling

- Throws if the underlying database query fails (e.g., the local database isn't initialized yet). The error message reflects whatever the underlying failure was — there's no fixed "Failed to fetch orders" prefix.

```typescript
// Example of error handling
try {
  await command.getOrders({ limit: 10 });
} catch (error) {
  console.error(error.message); // e.g. "Database is not initialized. Please ensure database is ready before performing operations."
}
```

## Order Object Structure

Each order in the `orders` array contains:
- `_id`: Order ID
- `receiptId`: Receipt identifier
- `status`: Order status ('completed', 'parked', 'refunded', etc.)
- `summary.total`: Order total, as an **integer in minor units** (e.g., cents — `2100` means `$21.00`), not a decimal amount
- `createdAt`: Creation timestamp
- `customer`: Customer information (if available)
- `posData`: POS-related data (employee, station, outlet, etc.)
- `lineItems`: Array of products in the order
- `customSales`: Array of custom sale items
- `paymentMethods`: Array of payment method entries (amounts also in minor units)
- `refund`: Refund information (for refunded orders)
- And more fields depending on the order type

