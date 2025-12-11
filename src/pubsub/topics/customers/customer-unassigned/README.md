# customer-unassigned Event

## Description

Fired when a customer is unassigned from the current cart/session.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-unassigned`

## Payload

```typescript
interface CustomerUnassignedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The customer object that was unassigned from the cart (before removal). |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerUnassignedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerUnassignedEvent) => {
    if (event.type === 'customer-unassigned') {
        console.log('Customer unassigned from cart:', event.data.customer);
        // Clear customer info from cart UI
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerUnassignedPayload } from '@final-commerce/command-frame';

// When a customer is unassigned from the cart
topicPublisher.publish('customers', 'customer-unassigned', {
    customer: customer
} as CustomerUnassignedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CustomerUnassignedPayload` - Event payload type
- `CustomerUnassignedEvent` - Full event type with topic, type, data, and timestamp

