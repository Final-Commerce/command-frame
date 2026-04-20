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

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductFeeAddedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductFeeAddedEvent) => {
    if (event.type === 'product-fee-added') {
        console.log(event.data);
    }
});
```
