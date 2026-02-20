# inventory-adjusted Event

## Description

Published when a variant's inventory stock is manually adjusted (add, subtract, or set/recount).

## Event Type

- **Topic**: `products`
- **Event ID**: `inventory-adjusted`

## Payload

```typescript
interface InventoryAdjustedPayload {
    variantId: string;
    amount: number;
    stockType: "add" | "subtract";
    previousStock?: number;
    newStock?: number;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `variantId` | `string` | The ID of the variant whose inventory was adjusted. |
| `amount` | `number` | The adjustment amount. |
| `stockType` | `"add" \| "subtract"` | Whether stock was added or subtracted. |
| `previousStock` | `number` (optional) | The stock level before the adjustment. |
| `newStock` | `number` (optional) | The stock level after the adjustment. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { InventoryAdjustedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: InventoryAdjustedEvent) => {
    if (event.type === 'inventory-adjusted') {
        console.log('Inventory adjusted for variant:', event.data.variantId);
        console.log(`${event.data.stockType} ${event.data.amount} units`);
        console.log(`Stock: ${event.data.previousStock} -> ${event.data.newStock}`);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { InventoryAdjustedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('products', 'inventory-adjusted', {
    variantId: variant._id,
    amount: 5,
    stockType: 'add',
    previousStock: 10,
    newStock: 15
} as InventoryAdjustedPayload);
```

## Related Types

- `InventoryAdjustedPayload` - Event payload type
- `InventoryAdjustedEvent` - Full event type with topic, type, data, and timestamp
