# product-deleted Event

## Description

Published when a product is soft-deleted from the catalog (for example after the iframe calls [`deleteProduct`](../../../../actions/delete-product/README.md)). Deletion cascades to the product's variants, so the event also lists the variant ids that were soft-deleted along with it.

## Event Type

- **Topic**: `products`
- **Event ID**: `product-deleted`

## Payload

```typescript
interface ProductDeletedPayload {
  productId: string;
  deletedVariantIds: string[];
}
```

### Payload Fields

| Field               | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `productId`         | `string`   | The ID of the deleted product.                                                          |
| `deletedVariantIds` | `string[]` | Ids of the product's variants that were cascade soft-deleted along with it (spec §6.6). |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { ProductDeletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('products', (event: ProductDeletedEvent) => {
  if (event.type === 'product-deleted') {
    console.log('Product deleted:', event.data.productId);
    console.log('Deleted variants:', event.data.deletedVariantIds);
    // Remove the product from your product list
  }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { ProductDeletedPayload } from '@final-commerce/command-frame';

// When a product is soft-deleted
topicPublisher.publish('products', 'product-deleted', {
  productId: deletedProductId,
  deletedVariantIds,
} as ProductDeletedPayload);
```

## Related commands

- [`deleteProduct`](../../../../actions/delete-product/README.md) - Delete a product by id from the iframe (Render host)

## Related Types

- `ProductDeletedPayload` - Event payload type
- `ProductDeletedEvent` - Full event type with topic, type, data, and timestamp
