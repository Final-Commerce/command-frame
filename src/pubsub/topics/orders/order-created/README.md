# order-created Event

## Description

Fired when a new order is created in the system.

## Event Type

- **Topic**: `orders`
- **Event ID**: `order-created`

## Payload

```typescript
interface OrderCreatedPayload {
    order: CFOrder;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `order` | `CFOrder` | The newly created order object with all order fields including `_id`, `receiptId`, `status`, `customer`, `lineItems`, `paymentMethods`, etc. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { OrderCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('orders', (event: OrderCreatedEvent) => {
    if (event.type === 'order-created') {
        console.log('New order created:', event.data.order);
        // Update your order list, show notification, etc.
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { OrderCreatedPayload } from '@final-commerce/command-frame';

// When an order is created
topicPublisher.publish('orders', 'order-created', {
    order: newOrder
} as OrderCreatedPayload);
```

## Related Types

- `CFOrder` - Order type from CommonTypes
- `OrderCreatedPayload` - Event payload type
- `OrderCreatedEvent` - Full event type with topic, type, data, and timestamp

