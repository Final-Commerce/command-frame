# cart-discount-removed Event

## Description

Fired when a discount is removed from the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `cart-discount-removed`

## Payload

```typescript
interface CartDiscountRemovedPayload {
    // No additional data needed - discount was removed
}
```

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartDiscountRemovedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartDiscountRemovedEvent) => {
    if (event.type === 'cart-discount-removed') {
        console.log('Discount removed from cart');
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartDiscountRemovedPayload } from '@final-commerce/command-frame';

// When a discount is removed from the cart
topicPublisher.publish('cart', 'cart-discount-removed', {} as CartDiscountRemovedPayload);
```

## Related Types

- `CartDiscountRemovedPayload` - Event payload type
- `CartDiscountRemovedEvent` - Full event type with topic, type, data, and timestamp

