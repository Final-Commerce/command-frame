# customer-updated Event

## Description

Fired when a customer's information is updated in the system.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-updated`

## Payload

```typescript
interface CustomerUpdatedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The updated customer object with all current customer fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerUpdatedEvent) => {
    if (event.type === 'customer-updated') {
        console.log('Customer updated:', event.data.customer);
        // Refresh customer details in your UI
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerUpdatedPayload } from '@final-commerce/command-frame';

// When a customer is updated
topicPublisher.publish('customers', 'customer-updated', {
    customer: updatedCustomer
} as CustomerUpdatedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CustomerUpdatedPayload` - Event payload type
- `CustomerUpdatedEvent` - Full event type with topic, type, data, and timestamp

