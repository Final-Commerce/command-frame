# product-deleted Event

## Description

Published when a product is removed from the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-deleted`

## Payload

```typescript
interface ProductDeletedPayload {
    product: CFActiveProduct;
    internalId: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | `CFActiveProduct` | The product object that was removed from the cart. |
| `internalId` | `string` | The internal ID of the product that was removed. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductDeletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductDeletedEvent) => {
    if (event.type === 'product-deleted') {
        console.log('Product removed from cart:', event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductDeletedPayload } from '@final-commerce/command-frame';

// When a product is removed from the cart
topicPublisher.publish('cart', 'product-deleted', {
    product: removedProduct,
    internalId: internalId
} as ProductDeletedPayload);
```

## Related Types

- `CFActiveProduct` - Product type from CommonTypes
- `ProductDeletedPayload` - Event payload type
- `ProductDeletedEvent` - Full event type with topic, type, data, and timestamp

