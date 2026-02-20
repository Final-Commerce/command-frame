# Products Topic

## Overview

The `products` topic provides events related to product lifecycle and inventory management. Subscribe to this topic to receive real-time notifications when products are synced/created, updated, or when inventory stock changes.

## Topic Information

- **Topic ID**: `products`
- **Name**: Products
- **Description**: Topic for product-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [product-created](./product-created/README.md) | Published when a new product is synced/created | [View Details](./product-created/README.md) |
| [product-updated](./product-updated/README.md) | Published when a product is synced/updated | [View Details](./product-updated/README.md) |
| [inventory-adjusted](./inventory-adjusted/README.md) | Published when a variant's inventory stock is manually adjusted | [View Details](./inventory-adjusted/README.md) |
| [inventory-updated](./inventory-updated/README.md) | Published when a variant's inventory stock changes (e.g. after a sale or restock) | [View Details](./inventory-updated/README.md) |

## Quick Start

### Subscribe to All Product Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: TopicEvent) => {
    switch (event.type) {
        case 'product-created':
            console.log('New product created:', event.data.product);
            break;
        case 'product-updated':
            console.log('Product updated:', event.data.product);
            break;
        case 'inventory-adjusted':
            console.log('Inventory adjusted:', event.data.variantId, event.data.amount, event.data.stockType);
            break;
        case 'inventory-updated':
            console.log('Inventory updated:', event.data.variantId, event.data.previousStock, '->', event.data.newStock);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    ProductCreatedPayload,
    ProductCreatedEvent,
    ProductUpdatedPayload,
    ProductUpdatedEvent,
    InventoryAdjustedPayload,
    InventoryAdjustedEvent,
    InventoryUpdatedPayload,
    InventoryUpdatedEvent,
    ProductsEventType,
    ProductsEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFProduct` - Product type from CommonTypes
- `ProductsEventType` - Union type of all product event IDs
- `ProductsEventPayload` - Union type of all product event payloads

