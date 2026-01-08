# refund-updated Event

## Description

Published when a refund's information is updated in the system.

## Event Type

- **Topic**: `refunds`
- **Event ID**: `refund-updated`

## Payload

```typescript
interface RefundUpdatedPayload {
    refund: CFRefundItem;
    orderId: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `refund` | `CFRefundItem` | The updated refund object. |
| `orderId` | `string` | The ID of the order this refund is associated with. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RefundUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('refunds', (event: RefundUpdatedEvent) => {
    if (event.type === 'refund-updated') {
        console.log('Refund updated:', event.data.refund);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { RefundUpdatedPayload } from '@final-commerce/command-frame';

// When a refund is updated
topicPublisher.publish('refunds', 'refund-updated', {
    refund: updatedRefund,
    orderId: orderId
} as RefundUpdatedPayload);
```

## Related Types

- `CFRefundItem` - Refund type from CommonTypes
- `RefundUpdatedPayload` - Event payload type
- `RefundUpdatedEvent` - Full event type with topic, type, data, and timestamp

