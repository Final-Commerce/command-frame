# get-active-product Event

## Description

Published when the active product is retrieved. This event allows iframe apps to receive the currently active product in the POS interface.

## Event Type

- **Topic**: `products`
- **Event ID**: `get-active-product`

## Payload

```typescript
interface ProductGetActivePayload {
    product: CFActiveProduct;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `product` | [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) | The currently active product object in the POS interface. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductGetActiveEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: ProductGetActiveEvent) => {
    if (event.type === 'get-active-product') {
        console.log('Active product:', event.data.product);
        // Display product details, update UI, etc.
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductGetActivePayload } from '@final-commerce/command-frame';

// When the active product is retrieved
topicPublisher.publish('products', 'get-active-product', {
    product: activeProduct
} as ProductGetActivePayload);
```

## Related Types

- [`CFActiveProduct`](../../../../types/README.md#cfactiveproduct) - Active product type from CommonTypes
- `ProductGetActivePayload` - Event payload type
- `ProductGetActiveEvent` - Full event type with topic, type, data, and timestamp
