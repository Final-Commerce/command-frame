# inventory-updated Event

## Description

Published when a variant's inventory stock changes, for example after a sale completes or a restock is processed.

## Event Type

- **Topic**: `products`
- **Event ID**: `inventory-updated`

## Payload

```typescript
interface InventoryUpdatedPayload {
    variantId: string;
    previousStock?: number;
    newStock?: number;
    delta?: number;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `variantId` | `string` | The ID of the variant whose inventory changed. |
| `previousStock` | `number` (optional) | The stock level before the change. |
| `newStock` | `number` (optional) | The stock level after the change. |
| `delta` | `number` (optional) | The difference between the new and previous stock levels. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { InventoryUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: InventoryUpdatedEvent) => {
    if (event.type === 'inventory-updated') {
        console.log('Inventory updated for variant:', event.data.variantId);
        console.log(`Stock: ${event.data.previousStock} -> ${event.data.newStock} (delta: ${event.data.delta})`);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { InventoryUpdatedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('products', 'inventory-updated', {
    variantId: variant._id,
    previousStock: 10,
    newStock: 9,
    delta: -1
} as InventoryUpdatedPayload);
```

## Related Types

- `InventoryUpdatedPayload` - Event payload type
- `InventoryUpdatedEvent` - Full event type with topic, type, data, and timestamp
