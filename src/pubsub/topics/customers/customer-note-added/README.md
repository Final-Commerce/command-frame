# customer-note-added Event

## Description

Fired when a note is added to a customer's record.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-note-added`

## Payload

```typescript
interface CustomerNoteAddedPayload {
    customer: CFCustomer;
    note: CFCustomerNote;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The customer object with updated notes array. |
| `note` | `CFCustomerNote` | The newly added note object with `createdAt` and `message` fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerNoteAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerNoteAddedEvent) => {
    if (event.type === 'customer-note-added') {
        console.log('Note added to customer:', event.data.customer._id);
        console.log('Note:', event.data.note);
        // Update customer notes display
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerNoteAddedPayload } from '@final-commerce/command-frame';

// When a note is added to a customer
topicPublisher.publish('customers', 'customer-note-added', {
    customer: updatedCustomer,
    note: newNote
} as CustomerNoteAddedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CFCustomerNote` - Customer note type from CommonTypes
- `CustomerNoteAddedPayload` - Event payload type
- `CustomerNoteAddedEvent` - Full event type with topic, type, data, and timestamp

