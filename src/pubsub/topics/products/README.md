# Products Topic

## Overview

The `products` topic provides events related to product lifecycle. Subscribe to this topic to receive real-time notifications when products are synced/created, updated, or when the active product changes in the POS interface.

## Topic Information

- **Topic ID**: `products`
- **Name**: Products
- **Description**: Topic for product-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [product-created](./product-created/README.md) | Published when a new product is synced/created | [View Details](./product-created/README.md) |
| [product-updated](./product-updated/README.md) | Published when a product is synced/updated | [View Details](./product-updated/README.md) |
| [set-active-product](./product-set-active/README.md) | Published when a product is set as the active product | [View Details](./product-set-active/README.md) |
| [get-active-product](./product-get-active/README.md) | Published when the active product is retrieved | [View Details](./product-get-active/README.md) |

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
        case 'set-active-product':
            console.log('Active product set:', event.data.product);
            break;
        case 'get-active-product':
            console.log('Active product retrieved:', event.data.product);
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
    ProductSetActivePayload,
    ProductSetActiveEvent,
    ProductGetActivePayload,
    ProductGetActiveEvent,
    ProductsEventType,
    ProductsEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- [`CFProduct`](../../../types/README.md#cfproduct) - Product type from CommonTypes
- [`CFActiveProduct`](../../../types/README.md#cfactiveproduct) - Active product type from CommonTypes
- `ProductsEventType` - Union type of all product event IDs
- `ProductsEventPayload` - Union type of all product event payloads

