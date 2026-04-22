# product-fee-added Event

## Description

Published when a fee is applied to a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-fee-added`

## Payload

```typescript
interface ProductFeeAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    fee: {
        amount: number;
        isPercent: boolean;
        label: string;
        applyTaxes: boolean;
    };
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the fee is applied. |
| `internalId` | `string` (optional) | Cart line `internalId` when the host includes it. |
| `fee` | `object` | Fee parameters (`amount`, `isPercent`, `label`, `applyTaxes`). |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductFeeAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductFeeAddedEvent) => {
    if (event.type === 'product-fee-added') {
        console.log('Fee on line:', event.data.internalId, event.data.fee);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductFeeAddedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'product-fee-added', {
    product,
    internalId: product.internalId,
    fee: { amount: 1.5, isPercent: false, label: 'Service', applyTaxes: true }
} as ProductFeeAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
- `ProductFeeAddedPayload` / `ProductFeeAddedEvent`
