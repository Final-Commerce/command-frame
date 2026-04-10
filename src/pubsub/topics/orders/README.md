# Orders Topic

## Overview

The `orders` topic provides events related to order lifecycle. Subscribe to this topic to receive real-time notifications when orders are created or updated, when the active order changes, or when the host publishes an active-order snapshot.

## Topic Information

- **Topic ID**: `orders`
- **Name**: Orders
- **Description**: Topic for order-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [order-created](./order-created/README.md) | Published when a new order is created | [View Details](./order-created/README.md) |
| [order-updated](./order-updated/README.md) | Published when an order is updated | [View Details](./order-updated/README.md) |
| [set-active-order](./set-active-order/README.md) | Published when the active order is set in the host | [View Details](./set-active-order/README.md) |
| [get-active-order](./get-active-order/README.md) | Reserved for host publish of active order snapshots | [View Details](./get-active-order/README.md) |

## Quick Start

### Subscribe to All Order Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('orders', (event: TopicEvent) => {
    switch (event.type) {
        case 'order-created':
            console.log('New order created:', event.data.order);
            break;
        case 'order-updated':
            console.log('Order updated:', event.data.order);
            break;
        case 'set-active-order':
            console.log('Active order set:', event.data.order);
            break;
        case 'get-active-order':
            console.log('Active order snapshot:', event.data.order);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    OrderCreatedPayload,
    OrderCreatedEvent,
    OrderUpdatedPayload,
    OrderUpdatedEvent,
    OrderActiveSetPayload,
    OrderActiveSetEvent,
    OrderActiveGetPayload,
    OrderActiveGetEvent,
    OrdersEventType,
    OrdersEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFOrder` - Order type from CommonTypes
- `OrdersEventType` - Union type of all order event IDs
- `OrdersEventPayload` - Union type of all order event payloads

