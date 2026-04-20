# product-note-removed Event

## Description

Published when a note is removed from a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-note-removed`

## Payload

```typescript
interface ProductNoteRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}
```

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductNoteRemovedEvent } from '@final-commerce/command-frame';

topics.subscribe('cart', (event: ProductNoteRemovedEvent) => {
    if (event.type === 'product-note-removed') {
        console.log(event.data);
    }
});
```
