# Cart Topic

## Overview

The `cart` topic provides events related to cart operations. Subscribe to this topic to receive real-time notifications when the cart is created, products are added/removed, discounts or fees are applied, or customers are assigned.

## Topic Information

- **Topic ID**: `cart`
- **Name**: Cart
- **Description**: Topic for cart-related events

## Events

Source of truth for IDs: [`index.ts`](./index.ts) (`eventTypes[].id`). Payload unions: [`types.ts`](./types.ts) (`CartEventType`, `CartEventPayload`).

| Event | Description | Documentation |
|-------|-------------|---------------|
| `cart-created` | Published when a new cart is created | [View Details](./cart-created/README.md) |
| `customer-assigned` | Published when a customer is assigned to the cart | [View Details](./customer-assigned/README.md) |
| `customer-unassigned` | Published when a customer is removed from the cart | Listed in [`index.ts`](./index.ts); payload typing is part of the cart event unions in [`types.ts`](./types.ts) |
| `product-added` | Published when a product is added to the cart | [View Details](./product-added/README.md) |
| `product-deleted` | Published when a product is removed from the cart | [View Details](./product-deleted/README.md) |
| `product-updated` | Published when a product quantity is updated in the cart | [View Details](./product-updated/README.md) |
| `cart-discount-added` | Published when a discount is added to the cart | [View Details](./cart-discount-added/README.md) |
| `cart-discount-removed` | Published when a discount is removed from the cart | [View Details](./cart-discount-removed/README.md) |
| `cart-fee-added` | Published when a fee is added to the cart | [View Details](./cart-fee-added/README.md) |
| `cart-fee-removed` | Published when a fee is removed from the cart | [View Details](./cart-fee-removed/README.md) |
| `product-discount-added` | Published when a discount is added to a product line in the cart | Types: [`product-discount-added/types.ts`](./product-discount-added/types.ts) |
| `product-discount-removed` | Published when a discount is removed from a product line | Types: [`product-discount-removed/types.ts`](./product-discount-removed/types.ts) |
| `product-fee-added` | Published when a fee is added to a product line in the cart | Types: [`product-fee-added/types.ts`](./product-fee-added/types.ts) |
| `product-fee-removed` | Published when a fee is removed from a product line | Types: [`product-fee-removed/types.ts`](./product-fee-removed/types.ts) |
| `product-note-added` | Published when a note is added to a product line | Types: [`product-note-added/types.ts`](./product-note-added/types.ts) |
| `product-note-removed` | Published when a note is removed from a product line | Types: [`product-note-removed/types.ts`](./product-note-removed/types.ts) |

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
        case 'customer-unassigned':
            console.log('Customer unassigned');
            break;
        case 'product-added':
            console.log('Product added:', event.data.product);
            break;
        case 'product-deleted':
            console.log('Product removed:', event.data.product);
            break;
        case 'product-updated':
            console.log('Product updated:', event.data.product);
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
        case 'product-discount-added':
        case 'product-discount-removed':
        case 'product-fee-added':
        case 'product-fee-removed':
        case 'product-note-added':
        case 'product-note-removed':
            console.log('Cart line event:', event.type, event.data);
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
    CartProductUpdatedPayload,
    CartProductUpdatedEvent,
    CartDiscountAddedPayload,
    CartDiscountAddedEvent,
    CartDiscountRemovedPayload,
    CartDiscountRemovedEvent,
    CartFeeAddedPayload,
    CartFeeAddedEvent,
    CartFeeRemovedPayload,
    CartFeeRemovedEvent,
    ProductDiscountAddedPayload,
    ProductDiscountAddedEvent,
    ProductDiscountRemovedPayload,
    ProductDiscountRemovedEvent,
    ProductFeeAddedPayload,
    ProductFeeAddedEvent,
    ProductFeeRemovedPayload,
    ProductFeeRemovedEvent,
    ProductNoteAddedPayload,
    ProductNoteAddedEvent,
    ProductNoteRemovedPayload,
    ProductNoteRemovedEvent,
    CartEventType,
    CartEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- [`CFActiveCart`](../../../types/README.md#cfactivecart) - Cart type from CommonTypes
- [`CFActiveProduct`](../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- [`CFCustomer`](../../../types/README.md#cfcustomer) - Customer type from CommonTypes
- [`CFDiscount`](../../../types/README.md#cfdiscount) - Discount type from CommonTypes
- [`CFCustomFee`](../../../types/README.md#cfcustomfee) - Fee type from CommonTypes
- `CartEventType` - Union type of all cart event IDs
- `CartEventPayload` - Union type of all cart event payloads

