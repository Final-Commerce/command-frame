# refund-created Event

## Description

Fired when a new refund is created in the system.

## Event Type

- **Topic**: `refunds`
- **Event ID**: `refund-created`

## Payload

```typescript
interface RefundCreatedPayload {
    refund: CFRefundItem;
    orderId: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `refund` | `CFRefundItem` | The newly created refund object with lineItems, customSales, cartFees, tips, summary, etc. |
| `orderId` | `string` | The ID of the order this refund is associated with. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RefundCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('refunds', (event: RefundCreatedEvent) => {
    if (event.type === 'refund-created') {
        console.log('New refund created:', event.data.refund);
        console.log('Order ID:', event.data.orderId);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { RefundCreatedPayload } from '@final-commerce/command-frame';

// When a refund is created
topicPublisher.publish('refunds', 'refund-created', {
    refund: newRefund,
    orderId: orderId
} as RefundCreatedPayload);
```

## Related Types

- `CFRefundItem` - Refund type from CommonTypes
- `RefundCreatedPayload` - Event payload type
- `RefundCreatedEvent` - Full event type with topic, type, data, and timestamp

