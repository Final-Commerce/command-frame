# addCustomerNote

Adds a note to a customer's record.

## Parameters

- `note` (string, required): The note text to add
- `customerId` (string, optional): The ID of the customer. If omitted, defaults to the active customer in the current session.

## Response

```typescript
{
    success: boolean;
    customerId: string;
    noteId: string;
    note: string;
    timestamp: string;
}
```

## Usage

```typescript
import { command } from "@final-commerce/command-frame";

// Add a note to a customer
await command.addCustomerNote({
    customerId: "691df9c6c478bada1fb23d31",
    note: "Preferred delivery time: 2-4pm"
});
```

## Pub/Sub

After a successful add, kaching publishes **`customer-note-added`** on the **`customers`** topic. See [customer-note-added event](../../pubsub/topics/customers/customer-note-added/README.md).

## Error Handling

- Throws an error if `note` is missing
- Throws an error if no `customerId` is provided and there is no active customer to fall back to
- Throws an error if the customer is not found in the local database
- Throws an error if the note fails to save

## See also

- [removeCustomerNote](../remove-customer-note/README.md) - Delete a note by its `_id` without passing `customerId`
