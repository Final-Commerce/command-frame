# product-discount-removed Event

## Description

Published when a discount is removed from a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-discount-removed`

## Payload

```typescript
interface ProductDiscountRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}
```

### Payload Fields

| Field        | Type                                                             | Description                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The cart line product after the discount was removed.    |
| `internalId` | `string` (optional)                                              | Cart line internal identifier when the host provides it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductDiscountRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductDiscountRemovedEvent) => {
    if (event.type === "product-discount-removed") {
        console.log("Product discount removed:", event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductDiscountRemovedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-discount-removed", {
    product: updatedProduct
} as ProductDiscountRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- `ProductDiscountRemovedPayload` - Event payload type
- `ProductDiscountRemovedEvent` - Full event type with topic, type, data, and timestamp
