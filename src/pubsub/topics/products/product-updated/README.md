# product-updated Event

## Description

Fired when a product's information is synced/updated in the local database.

## Event Type

- **Topic**: `products`
- **Event ID**: `product-updated`

## Payload

```typescript
interface ProductUpdatedPayload {
    product: CFProduct;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | `CFProduct` | The updated product object with all current product fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: ProductUpdatedEvent) => {
    if (event.type === 'product-updated') {
        console.log('Product updated:', event.data.product);
        // Refresh product details in your UI
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductUpdatedPayload } from '@final-commerce/command-frame';

// When a product is synced/updated
topicPublisher.publish('products', 'product-updated', {
    product: updatedProduct
} as ProductUpdatedPayload);
```

## Related Types

- `CFProduct` - Product type from CommonTypes
- `ProductUpdatedPayload` - Event payload type
- `ProductUpdatedEvent` - Full event type with topic, type, data, and timestamp

