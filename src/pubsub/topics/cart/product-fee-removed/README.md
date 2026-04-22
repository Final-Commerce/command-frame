# product-fee-removed Event

## Description

Published when a fee is removed from a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-fee-removed`

## Payload

```typescript
interface ProductFeeRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}
```

### Payload Fields

| Field        | Type                                                             | Description                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The cart line product after the fee was removed.         |
| `internalId` | `string` (optional)                                              | Cart line internal identifier when the host provides it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeRemovedEvent) => {
    if (event.type === "product-fee-removed") {
        console.log("Product fee removed:", event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductFeeRemovedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-fee-removed", {
    product: updatedProduct
} as ProductFeeRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- `ProductFeeRemovedPayload` - Event payload type
- `ProductFeeRemovedEvent` - Full event type with topic, type, data, and timestamp
