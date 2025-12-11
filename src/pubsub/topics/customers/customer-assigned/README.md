# customer-assigned Event

## Description

Fired when a customer is assigned to the current cart/session.

## Event Type

- **Topic**: `customers`
- **Event ID**: `customer-assigned`

## Payload

```typescript
interface CustomerAssignedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer` | `CFCustomer` | The customer object that was assigned to the cart. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerAssignedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customers', (event: CustomerAssignedEvent) => {
    if (event.type === 'customer-assigned') {
        console.log('Customer assigned to cart:', event.data.customer);
        // Update cart UI to show customer info
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerAssignedPayload } from '@final-commerce/command-frame';

// When a customer is assigned to the cart
topicPublisher.publish('customers', 'customer-assigned', {
    customer: customer
} as CustomerAssignedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CustomerAssignedPayload` - Event payload type
- `CustomerAssignedEvent` - Full event type with topic, type, data, and timestamp

