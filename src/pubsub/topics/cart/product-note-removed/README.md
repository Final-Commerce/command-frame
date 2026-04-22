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

| Field        | Type                                                             | Description                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The cart line product after the note was removed.        |
| `internalId` | `string` (optional)                                              | Cart line internal identifier when the host provides it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductNoteRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductNoteRemovedEvent) => {
    if (event.type === "product-note-removed") {
        console.log("Product note removed:", event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductNoteRemovedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-note-removed", {
    product: updatedProduct
} as ProductNoteRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- `ProductNoteRemovedPayload` - Event payload type
- `ProductNoteRemovedEvent` - Full event type with topic, type, data, and timestamp
