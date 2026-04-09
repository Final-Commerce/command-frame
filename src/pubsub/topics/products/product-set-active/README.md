# set-active-product Event

## Description

Published when a product is set as the active product in the POS interface. This event notifies iframe apps that the user has selected or changed the currently active product.

## Event Type

- **Topic**: `products`
- **Event ID**: `set-active-product`

## Payload

```typescript
interface ProductSetActivePayload {
    product: CFActiveProduct;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The product being set as the active product in the POS interface. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductSetActiveEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: ProductSetActiveEvent) => {
    if (event.type === 'set-active-product') {
        console.log('Active product changed:', event.data.product);
        // React to active product change, update UI, etc.
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductSetActivePayload } from '@final-commerce/command-frame';

// When a product is set as active
topicPublisher.publish('products', 'set-active-product', {
    product: selectedProduct
} as ProductSetActivePayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Active product type from CommonTypes
- `ProductSetActivePayload` - Event payload type
- `ProductSetActiveEvent` - Full event type with topic, type, data, and timestamp
