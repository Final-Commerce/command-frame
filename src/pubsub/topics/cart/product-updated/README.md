# product-updated Event

## Description

Published when a product's quantity is updated in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-updated`

## Payload

```typescript
interface CartProductUpdatedPayload {
    product: CFActiveProduct;
    previousQuantity: number;
    newQuantity: number;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | `CFActiveProduct` | The product object that was updated in the cart. |
| `previousQuantity` | `number` | The quantity before the update. |
| `newQuantity` | `number` | The quantity after the update. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartProductUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartProductUpdatedEvent) => {
    if (event.type === 'product-updated') {
        console.log('Product updated in cart:', event.data.product);
        console.log(`Quantity changed from ${event.data.previousQuantity} to ${event.data.newQuantity}`);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartProductUpdatedPayload } from '@final-commerce/command-frame';

// When a product quantity is updated in the cart
topicPublisher.publish('cart', 'product-updated', {
    product: product,
    previousQuantity: oldQuantity,
    newQuantity: newQuantity
} as CartProductUpdatedPayload);
```

## Related Types

- `CFActiveProduct` - Product type from CommonTypes
- `CartProductUpdatedPayload` - Event payload type
- `CartProductUpdatedEvent` - Full event type with topic, type, data, and timestamp

