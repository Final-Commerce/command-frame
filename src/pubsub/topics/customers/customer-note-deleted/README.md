# customer-note-deleted Event

## Description

Published when a note is deleted from a customer's record.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-note-deleted`

## Payload

```typescript
interface CustomerNoteDeletedPayload {
    customer: CFCustomer;
    note: CFCustomerNote;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The customer object with updated notes array (note removed). |
| `note` | `CFCustomerNote` | The deleted note object with `createdAt` and `message` fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerNoteDeletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerNoteDeletedEvent) => {
    if (event.type === 'customer-note-deleted') {
        console.log('Note deleted from customer:', event.data.customer._id);
        console.log('Deleted note:', event.data.note);
        // Update customer notes display
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerNoteDeletedPayload } from '@final-commerce/command-frame';

// When a note is deleted from a customer
topicPublisher.publish('customers', 'customer-note-deleted', {
    customer: updatedCustomer,
    note: deletedNote
} as CustomerNoteDeletedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CFCustomerNote` - Customer note type from CommonTypes
- `CustomerNoteDeletedPayload` - Event payload type
- `CustomerNoteDeletedEvent` - Full event type with topic, type, data, and timestamp

