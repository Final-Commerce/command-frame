# removeCustomerNote

Removes a note from a customer's record using only the note's `_id`. The host (Render) finds the customer that owns the note in the local database, updates the customer document, and refreshes active/selected customer state when applicable.

You do **not** pass `customerId`; use the note id returned when the note was created (for example from [`addCustomerNote`](../add-customer-note/README.md) or from `getCustomers` / active customer `notes`).

## Parameters

- `noteId` (string, required): The `_id` of the note to remove

## Response

```typescript
{
    success: boolean;
    noteId: string;
    timestamp: string;
}
```

## Usage

```typescript
import { command } from "@final-commerce/command-frame";

await command.removeCustomerNote({
    noteId: "691df9c6c478bada1fb23d32"
});
```

## Pub/Sub

After a successful delete, Render publishes **`customer-note-deleted`** on the **`customers`** topic. See [customer-note-deleted event](../../pubsub/topics/customers/customer-note-deleted/README.md).

## Error Handling

- Throws if `noteId` is missing
- Throws if the note is not found in the local customer data (Render)

## See also

- [addCustomerNote](../add-customer-note/README.md)
