# product-note-added Event

## Description

Published when a note is added to a specific line item in the cart.

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

| Field        | Type                                                             | Description                                     |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line product.                              |
| `internalId` | `string` (optional)                                              | Cart line identifier when the host supplies it. |
| `note`       | `string`                                                         | Note text.                                      |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductNoteAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductNoteAddedEvent) => {
    if (event.type === "product-note-added") {
        console.log("Note added:", event.data.note, event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductNoteAddedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-note-added", payload as ProductNoteAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
