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
    customer: any;
    timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.assignCustomer({
    customerId: 'cust_123456789'
});

console.log('Assigned customer:', result.customer.firstName);
```

## Behavior

1. Retrieves the customer by ID from the local database.
2. Sets this customer as the active customer for the current cart/session.
3. Subsequent orders will be associated with this customer.
