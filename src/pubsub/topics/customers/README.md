# Customers Topic

## Overview

The `customers` topic provides events related to customer lifecycle and cart assignment. Subscribe to this topic to receive real-time notifications when customers are created, updated, assigned to carts, or when notes are added or removed.

## Topic Information

- **Topic ID**: `customers`
- **Name**: Customers
- **Description**: Topic for customer-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [customer-created](./customer-created/README.md) | Published when a new customer is created | [View Details](./customer-created/README.md) |
| [customer-updated](./customer-updated/README.md) | Published when a customer's information is updated | [View Details](./customer-updated/README.md) |
| [customer-note-added](./customer-note-added/README.md) | Published when a note is added to a customer | [View Details](./customer-note-added/README.md) |
| [customer-note-deleted](./customer-note-deleted/README.md) | Published when a note is deleted from a customer | [View Details](./customer-note-deleted/README.md) |
| [customer-assigned](./customer-assigned/README.md) | Published when a customer is assigned to the cart | [View Details](./customer-assigned/README.md) |
| [customer-unassigned](./customer-unassigned/README.md) | Published when a customer is unassigned from the cart | [View Details](./customer-unassigned/README.md) |

## Quick Start

### Subscribe to All Customer Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: TopicEvent) => {
    switch (event.type) {
        case 'customer-created':
            console.log('New customer created:', event.data.customer);
            break;
        case 'customer-updated':
            console.log('Customer updated:', event.data.customer);
            break;
        case 'customer-note-added':
            console.log('Note added:', event.data.note);
            break;
        case 'customer-note-deleted':
            console.log('Note deleted:', event.data.note);
            break;
        case 'customer-assigned':
            console.log('Customer assigned to cart:', event.data.customer);
            break;
        case 'customer-unassigned':
            console.log('Customer unassigned from cart:', event.data.customer);
            break;
    }
});
```

### Subscribe to Specific Event Types

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerCreatedEvent, CustomerAssignedEvent } from '@final-commerce/command-frame';

// Only listen for customer creation and assignment
const subscriptionId = topics.subscribe('customers', (event) => {
    if (event.type === 'customer-created') {
        const createdEvent = event as CustomerCreatedEvent;
        console.log('New customer:', createdEvent.data.customer);
    } else if (event.type === 'customer-assigned') {
        const assignedEvent = event as CustomerAssignedEvent;
        console.log('Customer assigned:', assignedEvent.data.customer);
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    CustomerCreatedPayload,
    CustomerCreatedEvent,
    CustomerUpdatedPayload,
    CustomerUpdatedEvent,
    CustomerNoteAddedPayload,
    CustomerNoteAddedEvent,
    CustomerNoteDeletedPayload,
    CustomerNoteDeletedEvent,
    CustomerAssignedPayload,
    CustomerAssignedEvent,
    CustomerUnassignedPayload,
    CustomerUnassignedEvent,
    CustomersEventType,
    CustomersEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CFCustomerNote` - Customer note type from CommonTypes
- `CustomersEventType` - Union type of all customer event IDs
- `CustomersEventPayload` - Union type of all customer event payloads

