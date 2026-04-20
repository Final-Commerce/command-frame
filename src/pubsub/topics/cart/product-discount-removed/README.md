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

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductDiscountRemovedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductDiscountRemovedEvent) => {
    if (event.type === 'product-discount-removed') {
        console.log(event.data);
    }
});
```
