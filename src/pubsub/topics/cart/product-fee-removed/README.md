# product-fee-removed Event

## Description

Published when a fee is removed from a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-fee-removed`

## Payload

```typescript
interface ProductFeeRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the fee is removed. |
| `internalId` | `string` (optional) | Cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductFeeRemovedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductFeeRemovedEvent) => {
    if (event.type === 'product-fee-removed') {
        console.log('Fee removed from line:', event.data.internalId);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductFeeRemovedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'product-fee-removed', {
    product,
    internalId: product.internalId
} as ProductFeeRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
- `ProductFeeRemovedPayload` / `ProductFeeRemovedEvent`
