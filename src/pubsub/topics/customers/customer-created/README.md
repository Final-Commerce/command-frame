# customer-created Event

## Description

Published when a new customer is created in the system.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-created`

## Payload

```typescript
interface CustomerCreatedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The newly created customer object with all customer fields including `_id`, `email`, `firstName`, `lastName`, `phone`, `billing`, `shipping`, etc. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerCreatedEvent) => {
    if (event.type === 'customer-created') {
        console.log('New customer created:', event.data.customer);
        // Update your customer list, show notification, etc.
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerCreatedPayload } from '@final-commerce/command-frame';

// When a customer is created
topicPublisher.publish('customers', 'customer-created', {
    customer: newCustomer
} as CustomerCreatedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CustomerCreatedPayload` - Event payload type
- `CustomerCreatedEvent` - Full event type with topic, type, data, and timestamp

