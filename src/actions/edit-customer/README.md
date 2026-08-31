# editCustomer

Updates an existing customer's information. Only the provided fields in `changes` are modified; all other fields remain unchanged.

**Note:** the `changes` type allows any `CFCustomer` field, but the current handler only applies `firstName`, `lastName`, `email`, and `phone`. Other fields listed below (`tags`, `metadata`, `notes`, `billing`, `shipping`, `externalId`, `fromOliver`, `id`, `source`, `outletId`, `totalSpent`, `lastAction`) are accepted by the type but silently ignored by the handler.

## Parameters

### `EditCustomerParams`

```typescript
interface EditCustomerParams {
  customerId: string;
  changes: Partial<Omit<CFCustomer, '_id' | 'createdAt' | 'updatedAt' | 'companyId'>>;
}
```

#### `customerId` (required)

The ID of the customer to update.

#### `changes` (required)

Object containing the fields to update. Only provided fields are changed.

**Updatable fields (applied by the handler):**

- `email` (string): Customer email address.
- `firstName` (string): Customer's first name.
- `lastName` (string): Customer's last name.
- `phone` (string): Customer's phone number.

At least one of these four fields must be provided in `changes`, or the call throws.

**Accepted by the type but currently ignored by the handler:**

- `tags` (string[]): Array of tags to associate with the customer.
- `metadata` (Record<string, string>[]): Custom metadata as key-value records.
- `notes` (Array<{ \_id: string; createdAt: string; message: string }>): Array of notes associated with the customer.
- `billing` (CFAddress | null): Billing address information.
- `shipping` (CFAddress | null): Shipping address information.
- `externalId` (string): External system identifier.
- `fromOliver` (boolean): Indicates if the customer originated from Oliver system.
- `id` (string): Public string id.
- `source` (CustomerPlatform): Origin platform of the customer record.
- `outletId` (string): ID of the outlet associated with the customer.
- `totalSpent` (number): Customer's total spend.
- `lastAction` (string): ISO 8601 timestamp of the customer's last action.

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
import { command } from '@final-commerce/command-frame';

const result = await command.editCustomer({
  customerId: '6931e04f53d9113bd5231dfd',
  changes: {
    firstName: 'Jane',
    phone: '9876543210',
  },
});
console.log(result.customer.firstName); // "Jane"
```

## Error Handling

The handler throws in these cases:

- `customerId` missing: `"customerId is required"`
- `changes` missing: `"changes object is required"`
- none of `firstName`, `lastName`, `email`, `phone` provided in `changes`: `"At least one of firstName, lastName, email, or phone must be provided in changes"`
- no customer found for `customerId`: `"Customer with ID ${customerId} not found"`
