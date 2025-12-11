# Cart Topic

## Overview

The `cart` topic provides events related to cart operations. Subscribe to this topic to receive real-time notifications when the cart is created, products are added/removed, discounts or fees are applied, or customers are assigned.

## Topic Information

- **Topic ID**: `cart`
- **Name**: Cart
- **Description**: Topic for cart-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [cart-created](./cart-created/README.md) | Fired when a new cart is created | [View Details](./cart-created/README.md) |
| [customer-assigned](./customer-assigned/README.md) | Fired when a customer is assigned to the cart | [View Details](./customer-assigned/README.md) |
| [product-added](./product-added/README.md) | Fired when a product is added to the cart | [View Details](./product-added/README.md) |
| [product-deleted](./product-deleted/README.md) | Fired when a product is removed from the cart | [View Details](./product-deleted/README.md) |
| [cart-discount-added](./cart-discount-added/README.md) | Fired when a discount is added to the cart | [View Details](./cart-discount-added/README.md) |
| [cart-discount-removed](./cart-discount-removed/README.md) | Fired when a discount is removed from the cart | [View Details](./cart-discount-removed/README.md) |
| [cart-fee-added](./cart-fee-added/README.md) | Fired when a fee is added to the cart | [View Details](./cart-fee-added/README.md) |
| [cart-fee-removed](./cart-fee-removed/README.md) | Fired when a fee is removed from the cart | [View Details](./cart-fee-removed/README.md) |

## Quick Start

### Subscribe to All Cart Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: TopicEvent) => {
    switch (event.type) {
        case 'cart-created':
            console.log('New cart created:', event.data.cart);
            break;
        case 'customer-assigned':
            console.log('Customer assigned:', event.data.customer);
            break;
        case 'product-added':
            console.log('Product added:', event.data.product);
            break;
        case 'product-deleted':
            console.log('Product removed:', event.data.product);
            break;
        case 'cart-discount-added':
            console.log('Discount added:', event.data.discount);
            break;
        case 'cart-discount-removed':
            console.log('Discount removed');
            break;
        case 'cart-fee-added':
            console.log('Fee added:', event.data.fee);
            break;
        case 'cart-fee-removed':
            console.log('Fee removed at index:', event.data.feeIndex);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    CartCreatedPayload,
    CartCreatedEvent,
    CartCustomerAssignedPayload,
    CartCustomerAssignedEvent,
    ProductAddedPayload,
    ProductAddedEvent,
    ProductDeletedPayload,
    ProductDeletedEvent,
    CartDiscountAddedPayload,
    CartDiscountAddedEvent,
    CartDiscountRemovedPayload,
    CartDiscountRemovedEvent,
    CartFeeAddedPayload,
    CartFeeAddedEvent,
    CartFeeRemovedPayload,
    CartFeeRemovedEvent,
    CartEventType,
    CartEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFActiveCart` - Cart type from CommonTypes
- `CFActiveProduct` - Product type from CommonTypes
- `CFCustomer` - Customer type from CommonTypes
- `CFDiscount` - Discount type from CommonTypes
- `CFCustomFee` - Fee type from CommonTypes
- `CartEventType` - Union type of all cart event IDs
- `CartEventPayload` - Union type of all cart event payloads

