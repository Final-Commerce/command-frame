# assignCustomer

Assigns an existing customer to the current active session/cart in the parent application.

## Parameters

### `AssignCustomerParams`

```typescript
interface AssignCustomerParams {
    customerId: string;  // Required
}
```

#### `customerId` (required)

The ID of the customer to assign to the current session.

## Response

### `AssignCustomerResponse`

```typescript
interface AssignCustomerResponse {
    success: boolean;
    customer: CFCustomer;
    timestamp: string;
}
```

## Errors

The returned promise rejects if:

- `customerId` is missing/empty — `Error("customerId is required")`
- No customer with that ID exists in the local database — `Error("Customer not found")`

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.assignCustomer({
    customerId: '65f4a2b91c3d8e07a6b5c4d3'
});

console.log('Assigned customer:', result.customer.firstName);
```

## Behavior

1. Retrieves the customer by ID from the local database.
2. Sets this customer as the active customer for the current cart/session.
3. Subsequent orders will be associated with this customer.
4. Publishes a `customer-assigned` event on both the `customers` and `cart` channels, with the assigned customer as payload.

## Events

| Channel | Event | Payload |
| --- | --- | --- |
| `customers` | `customer-assigned` | `{ customer: CFCustomer }` |
| `cart` | `customer-assigned` | `{ customer: CFCustomer }` |
