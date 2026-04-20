# product-note-removed Event

## Description

Published when a note is removed from a specific line item in the cart.

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

| Field        | Type                                                             | Description                                     |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line product after the note was removed.   |
| `internalId` | `string` (optional)                                              | Cart line identifier when the host supplies it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductNoteRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductNoteRemovedEvent) => {
    if (event.type === "product-note-removed") {
        console.log("Note removed from line:", event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductNoteRemovedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-note-removed", payload as ProductNoteRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
