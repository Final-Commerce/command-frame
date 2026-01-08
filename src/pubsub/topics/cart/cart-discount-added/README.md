# cart-discount-added Event

## Description

Published when a discount is added to the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `cart-discount-added`

## Payload

```typescript
interface CartDiscountAddedPayload {
    discount: CFDiscount;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `discount` | `CFDiscount` | The discount object that was added to the cart with `value`, `label`, and `isPercent` fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartDiscountAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartDiscountAddedEvent) => {
    if (event.type === 'cart-discount-added') {
        console.log('Discount added to cart:', event.data.discount);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartDiscountAddedPayload } from '@final-commerce/command-frame';

// When a discount is added to the cart
topicPublisher.publish('cart', 'cart-discount-added', {
    discount: discount
} as CartDiscountAddedPayload);
```

## Related Types

- `CFDiscount` - Discount type from CommonTypes
- `CartDiscountAddedPayload` - Event payload type
- `CartDiscountAddedEvent` - Full event type with topic, type, data, and timestamp

