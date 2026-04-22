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

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line including the new note. |
| `internalId` | `string` (optional) | Cart line `internalId` when the host includes it. |
| `note` | `string` | Note text. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductNoteAddedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: ProductNoteAddedEvent) => {
    if (event.type === 'product-note-added') {
        console.log('Note on line:', event.data.internalId, event.data.note);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductNoteAddedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'product-note-added', {
    product,
    internalId: product.internalId,
    note: 'No onions'
} as ProductNoteAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
- `ProductNoteAddedPayload` / `ProductNoteAddedEvent`
