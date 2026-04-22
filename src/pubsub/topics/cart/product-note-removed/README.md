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

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the note is cleared. |
| `internalId` | `string` (optional) | Cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductNoteRemovedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductNoteRemovedEvent) => {
    if (event.type === 'product-note-removed') {
        console.log('Note cleared on line:', event.data.internalId);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductNoteRemovedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'product-note-removed', {
    product,
    internalId: product.internalId
} as ProductNoteRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
- `ProductNoteRemovedPayload` / `ProductNoteRemovedEvent`
