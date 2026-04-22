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

| Field        | Type                                                             | Description                                                 |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the fee was removed.                        |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeRemovedEvent) => {
    if (event.type === "product-fee-removed") {
        console.log("Fee removed from line:", event.data.internalId);
    }
});
```

## Related Types

- `ProductFeeRemovedPayload` — Event payload type
- `ProductFeeRemovedEvent` — Full event type with topic, type, data, and timestamp
