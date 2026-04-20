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

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductFeeRemovedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductFeeRemovedEvent) => {
    if (event.type === 'product-fee-removed') {
        console.log(event.data);
    }
});
```
