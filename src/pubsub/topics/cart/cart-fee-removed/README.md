# cart-fee-removed Event

## Description

Published when a fee is removed from the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `cart-fee-removed`

## Payload

```typescript
interface CartFeeRemovedPayload {
    feeIndex: number;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `feeIndex` | `number` | The index of the fee that was removed from the cart. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartFeeRemovedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartFeeRemovedEvent) => {
    if (event.type === 'cart-fee-removed') {
        console.log('Fee removed from cart at index:', event.data.feeIndex);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartFeeRemovedPayload } from '@final-commerce/command-frame';

// When a fee is removed from the cart
topicPublisher.publish('cart', 'cart-fee-removed', {
    feeIndex: index
} as CartFeeRemovedPayload);
```

## Related Types

- `CartFeeRemovedPayload` - Event payload type
- `CartFeeRemovedEvent` - Full event type with topic, type, data, and timestamp

