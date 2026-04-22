# product-discount-added Event

## Description

Published when a discount is applied to a product line in the cart.

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

| Field        | Type                                                             | Description                                                 |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the discount was applied.                   |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it. |
| `discount`   | `object`                                                         | Discount parameters: `amount`, `isPercent`, `label`.        |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductDiscountAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductDiscountAddedEvent) => {
    if (event.type === "product-discount-added") {
        console.log("Discount added to line:", event.data.internalId, event.data.discount);
    }
});
```

## Related Types

- `ProductDiscountAddedPayload` — Event payload type
- `ProductDiscountAddedEvent` — Full event type with topic, type, data, and timestamp
