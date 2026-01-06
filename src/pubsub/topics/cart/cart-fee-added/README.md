# cart-fee-added Event

## Description

Published when a fee is added to the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `cart-fee-added`

## Payload

```typescript
interface CartFeeAddedPayload {
    fee: CFCustomFee;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `fee` | `CFCustomFee` | The fee object that was added to the cart with `label`, `amount`, `isPercent`, and `applyTaxes` fields. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CartFeeAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CartFeeAddedEvent) => {
    if (event.type === 'cart-fee-added') {
        console.log('Fee added to cart:', event.data.fee);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CartFeeAddedPayload } from '@final-commerce/command-frame';

// When a fee is added to the cart
topicPublisher.publish('cart', 'cart-fee-added', {
    fee: fee
} as CartFeeAddedPayload);
```

## Related Types

- `CFCustomFee` - Fee type from CommonTypes
- `CartFeeAddedPayload` - Event payload type
- `CartFeeAddedEvent` - Full event type with topic, type, data, and timestamp

