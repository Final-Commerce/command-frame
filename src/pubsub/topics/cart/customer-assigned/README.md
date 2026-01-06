# customer-assigned Event (Cart Topic)

## Description

Published when a customer is assigned to the current cart/session.

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-assigned`

## Payload

```typescript
interface CartCustomerAssignedPayload {
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
import type { CartCustomerAssignedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartCustomerAssignedEvent) => {
    if (event.type === 'customer-assigned') {
        console.log('Customer assigned to cart:', event.data.customer);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartCustomerAssignedPayload } from '@final-commerce/command-frame';

// When a customer is assigned to the cart
topicPublisher.publish('cart', 'customer-assigned', {
    customer: customer
} as CartCustomerAssignedPayload);
```

## Related Types

- `CFCustomer` - Customer type from CommonTypes
- `CartCustomerAssignedPayload` - Event payload type
- `CartCustomerAssignedEvent` - Full event type with topic, type, data, and timestamp

