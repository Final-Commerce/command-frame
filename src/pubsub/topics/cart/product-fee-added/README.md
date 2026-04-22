# product-fee-added Event

## Description

Published when a fee is added to a product line in the cart.

## Event Type

- **Topic**: `cart`
- **Event ID**: `product-fee-added`

## Payload

```typescript
interface ProductFeeAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    fee: {
        amount: number;
        isPercent: boolean;
        label: string;
        applyTaxes: boolean;
    };
}
```

### Payload Fields

| Field        | Type                                                             | Description                                                  |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The cart line product after the fee was applied.             |
| `internalId` | `string` (optional)                                              | Cart line internal identifier when the host provides it.     |
| `fee`        | `object`                                                         | Fee amount, percentage flag, label, and whether taxes apply. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeAddedEvent) => {
    if (event.type === "product-fee-added") {
        console.log("Product fee added:", event.data.product, event.data.fee);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductFeeAddedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-fee-added", {
    product: updatedProduct,
    fee: { amount: 2, isPercent: false, label: "Service fee", applyTaxes: false }
} as ProductFeeAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- `ProductFeeAddedPayload` - Event payload type
- `ProductFeeAddedEvent` - Full event type with topic, type, data, and timestamp
