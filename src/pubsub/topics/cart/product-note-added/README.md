# product-note-added Event

## Description

Published when a note is added to a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-note-added`

## Payload

```typescript
interface ProductNoteAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    note: string;
}
```

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductNoteAddedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductNoteAddedEvent) => {
    if (event.type === 'product-note-added') {
        console.log(event.data);
    }
});
```
