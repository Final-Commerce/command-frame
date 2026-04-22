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

| Field        | Type                                                             | Description                                                 |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the note was added.                         |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it. |
| `note`       | `string`                                                         | Note text.                                                  |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductNoteAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductNoteAddedEvent) => {
    if (event.type === "product-note-added") {
        console.log("Note added to line:", event.data.internalId, event.data.note);
    }
});
```

## Related Types

- `ProductNoteAddedPayload` — Event payload type
- `ProductNoteAddedEvent` — Full event type with topic, type, data, and timestamp
