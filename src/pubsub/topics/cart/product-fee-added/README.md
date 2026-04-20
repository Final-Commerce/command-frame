# product-fee-added Event

## Description

Published when a fee is applied to a specific line item in the cart.

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

| Field        | Type                                                             | Description                                                |
| ------------ | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line product after the fee was applied.               |
| `internalId` | `string` (optional)                                              | Cart line identifier when the host supplies it.            |
| `fee`        | `object`                                                         | Applied fee: `amount`, `isPercent`, `label`, `applyTaxes`. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeAddedEvent) => {
    if (event.type === "product-fee-added") {
        console.log("Product fee:", event.data.fee, event.data.product);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { ProductFeeAddedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "product-fee-added", payload as ProductFeeAddedPayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct)
