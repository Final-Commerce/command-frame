# product-added Event

## Description

Published when a product is added to the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-added`

## Payload

```typescript
interface ProductAddedPayload {
    product: CFActiveProduct;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | `CFActiveProduct` | The product object that was added to the cart. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductAddedEvent) => {
    if (event.type === 'product-added') {
        console.log('Product added to cart:', event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductAddedPayload } from '@final-commerce/command-frame';

// When a product is added to the cart
topicPublisher.publish('cart', 'product-added', {
    product: product
} as ProductAddedPayload);
```

## Related Types

- `CFActiveProduct` - Product type from CommonTypes
- `ProductAddedPayload` - Event payload type
- `ProductAddedEvent` - Full event type with topic, type, data, and timestamp

