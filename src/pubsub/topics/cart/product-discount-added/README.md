# product-discount-added Event

## Description

Published when a discount is added to a product line in the cart.

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

| Field        | Type                                                             | Description                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The cart line product after the discount was applied.    |
| `internalId` | `string` (optional)                                              | Cart line internal identifier when the host provides it. |
| `discount`   | `object`                                                         | Discount value, percentage flag, and label.              |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductDiscountAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductDiscountAddedEvent) => {
    if (event.type === "product-discount-added") {
        console.log("Product discount added:", event.data.product, event.data.discount);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductDiscountAddedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-discount-added", {
    product: updatedProduct,
    discount: { amount: 10, isPercent: true, label: "10% off" }
} as ProductDiscountAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- `ProductDiscountAddedPayload` - Event payload type
- `ProductDiscountAddedEvent` - Full event type with topic, type, data, and timestamp
