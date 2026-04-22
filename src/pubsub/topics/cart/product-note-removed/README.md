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

| Field        | Type                                                             | Description                                                 |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the note was removed.                       |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductNoteRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductNoteRemovedEvent) => {
    if (event.type === "product-note-removed") {
        console.log("Note removed from line:", event.data.internalId);
    }
});
```

## Related Types

- `ProductNoteRemovedPayload` — Event payload type
- `ProductNoteRemovedEvent` — Full event type with topic, type, data, and timestamp
