# product-created Event

## Description

Fired when a new product is synced/created in the local database.

## Event Type

- **Topic**: `products`
- **Event ID**: `product-created`

## Payload

```typescript
interface ProductCreatedPayload {
    product: CFProduct;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | `CFProduct` | The newly created/synced product object with all product fields including `_id`, `name`, `variants`, `categories`, etc. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: ProductCreatedEvent) => {
    if (event.type === 'product-created') {
        console.log('New product created:', event.data.product);
        // Update your product list, show notification, etc.
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductCreatedPayload } from '@final-commerce/command-frame';

// When a product is synced/created
topicPublisher.publish('products', 'product-created', {
    product: newProduct
} as ProductCreatedPayload);
```

## Related Types

- `CFProduct` - Product type from CommonTypes
- `ProductCreatedPayload` - Event payload type
- `ProductCreatedEvent` - Full event type with topic, type, data, and timestamp

