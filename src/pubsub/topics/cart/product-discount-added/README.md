# product-discount-added Event

## Description

Published when a discount is applied to a specific line item in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-discount-added`

## Payload

```typescript
interface ProductDiscountAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    discount: {
        amount: number;
        isPercent: boolean;
        label: string;
    };
}
```

### Payload Fields

| Field        | Type                                                             | Description                                       |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line product after the discount was applied. |
| `internalId` | `string` (optional)                                              | Cart line identifier when the host supplies it.   |
| `discount`   | `object`                                                         | Applied discount: `amount`, `isPercent`, `label`. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductDiscountAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductDiscountAddedEvent) => {
    if (event.type === "product-discount-added") {
        console.log("Product discount:", event.data.discount, event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductDiscountAddedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-discount-added", payload as ProductDiscountAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product in cart context
