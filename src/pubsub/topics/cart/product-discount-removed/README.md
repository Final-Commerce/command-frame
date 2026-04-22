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

| Field        | Type                                                             | Description                                                 |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the discount was removed.                   |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductDiscountRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductDiscountRemovedEvent) => {
    if (event.type === "product-discount-removed") {
        console.log("Discount removed from line:", event.data.internalId);
    }
});
```

## Related Types

- `ProductDiscountRemovedPayload` — Event payload type
- `ProductDiscountRemovedEvent` — Full event type with topic, type, data, and timestamp
