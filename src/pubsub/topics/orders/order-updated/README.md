# order-updated Event

## Description

Fired when an order's information is updated in the system.

## Event Type

- **Topic**: `orders`
- **Event ID**: `order-updated`

## Payload

```typescript
interface OrderUpdatedPayload {
    order: CFOrder;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `order` | `CFOrder` | The updated order object with all current order fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { OrderUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('orders', (event: OrderUpdatedEvent) => {
    if (event.type === 'order-updated') {
        console.log('Order updated:', event.data.order);
        // Refresh order details in your UI
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { OrderUpdatedPayload } from '@final-commerce/command-frame';

// When an order is updated
topicPublisher.publish('orders', 'order-updated', {
    order: updatedOrder
} as OrderUpdatedPayload);
```

## Related Types

- `CFOrder` - Order type from CommonTypes
- `OrderUpdatedPayload` - Event payload type
- `OrderUpdatedEvent` - Full event type with topic, type, data, and timestamp

