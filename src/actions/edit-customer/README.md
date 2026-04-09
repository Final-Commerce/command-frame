# editCustomer

Updates an existing customer's information. Only the provided fields in `changes` are modified; all other fields remain unchanged.

## Parameters

### `EditCustomerParams`

```typescript
interface EditCustomerParams {
    customerId: string;
    changes: Partial<Omit<CFCustomer, "_id" | "createdAt" | "updatedAt" | "companyId">>;
}
```

#### `customerId` (required)

The ID of the customer to update.

#### `changes` (required)

Object containing the fields to update. Only provided fields are changed.

**Updatable fields:**

- `email` (string): Customer email address.
- `firstName` (string): Customer's first name.
- `lastName` (string): Customer's last name.
- `phone` (string): Customer's phone number.
- `tags` (string[]): Array of tags to associate with the customer.
- `metadata` (Array<{ key: string; value: string }>): Custom metadata as key-value pairs.
- `notes` (Array<{ createdAt: string; message: string }>): Array of notes associated with the customer.
- `billing` (CFAddress | null): Billing address information.
- `shipping` (CFAddress | null): Shipping address information.
- `externalId` (string): External system identifier.
- `fromOliver` (boolean): Indicates if the customer originated from Oliver system.

## Response

### `EditCustomerResponse`

```typescript
interface EditCustomerResponse {
    success: boolean;
    customer: CFCustomer;
    timestamp: string;
}
```

Returns the updated customer with all current data.

## Usage

```typescript
import { command } from "@final-commerce/command-frame";

const result = await command.editCustomer({
    customerId: "6931e04f53d9113bd5231dfd",
    changes: {
        firstName: "Jane",
        phone: "9876543210"
    }
});
console.log(result.customer.firstName); // "Jane"
```

## Error Handling

If the update fails, the handler will throw an error. Common error scenarios include missing `customerId`, invalid email format, or customer not found.
