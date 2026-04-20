# product-fee-removed Event

## Description

Published when a fee is removed from a specific line item in the cart.

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

| Field        | Type                                                             | Description                                     |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line product after the fee was removed.    |
| `internalId` | `string` (optional)                                              | Cart line identifier when the host supplies it. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeRemovedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeRemovedEvent) => {
    if (event.type === "product-fee-removed") {
        console.log("Fee removed from line:", event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductFeeRemovedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-fee-removed", payload as ProductFeeRemovedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
