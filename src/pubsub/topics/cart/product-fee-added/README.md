# product-fee-added Event

## Description

Published when a fee is applied to a product line in the cart.

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

| Field        | Type                                                             | Description                                                   |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| `product`    | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | Cart line after the fee was applied.                          |
| `internalId` | `string`                                                         | Optional; cart line `internalId` when the host includes it.   |
| `fee`        | `object`                                                         | Fee parameters: `amount`, `isPercent`, `label`, `applyTaxes`. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { ProductFeeAddedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: ProductFeeAddedEvent) => {
    if (event.type === "product-fee-added") {
        console.log("Fee added to line:", event.data.internalId, event.data.fee);
    }
});
```

## Related Types

- `ProductFeeAddedPayload` — Event payload type
- `ProductFeeAddedEvent` — Full event type with topic, type, data, and timestamp
