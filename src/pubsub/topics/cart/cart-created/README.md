# cart-created Event

## Description

Published when a new cart is created (when first product is added to an empty cart or when cart is cleared/reset).

## Event Type

- **Topic**: `cart`
- **Event ID**: `cart-created`

## Payload

```typescript
interface CartCreatedPayload {
    cart: CFActiveCart;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `cart` | `CFActiveCart` | The newly created cart object with products, totals, discounts, fees, etc. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartCreatedEvent) => {
    if (event.type === 'cart-created') {
        console.log('New cart created:', event.data.cart);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartCreatedPayload } from '@final-commerce/command-frame';

// When a cart is created
topicPublisher.publish('cart', 'cart-created', {
    cart: newCart
} as CartCreatedPayload);
```

## Related Types

- `CFActiveCart` - Cart type from CommonTypes
- `CartCreatedPayload` - Event payload type
- `CartCreatedEvent` - Full event type with topic, type, data, and timestamp

