# product-discount-added Event

## Description

Published when a discount is applied to a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-discount-added`

## Payload

```typescript
interface ProductDiscountAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    discount: {
        amount: number;
        isPercent: boolean;
        label: string;
    };
}
```

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductDiscountAddedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductDiscountAddedEvent) => {
    if (event.type === 'product-discount-added') {
        console.log(event.data.discount, event.data.product);
    }
});
```
