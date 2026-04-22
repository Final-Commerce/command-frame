# product-discount-removed Event

## Description

Published when a discount is removed from a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-discount-removed`

## Payload

```typescript
interface ProductDiscountRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the discount is removed. |
| `internalId` | `string` (optional) | Cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductDiscountRemovedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductDiscountRemovedEvent) => {
    if (event.type === 'product-discount-removed') {
        console.log('Discount removed from line:', event.data.internalId);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductDiscountRemovedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'product-discount-removed', {
    product,
    internalId: product.internalId
} as ProductDiscountRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
- `ProductDiscountRemovedPayload` / `ProductDiscountRemovedEvent`
