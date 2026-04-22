# Cart Topic

## Overview

The `cart` topic provides events related to cart operations. Subscribe to this topic to receive real-time notifications when the cart is created, customers are assigned or removed, products are added/removed/updated, cart-level or line-level discounts and fees change, or product notes change.

## Topic Information

- **Topic ID**: `cart`
- **Name**: Cart
- **Description**: Topic for cart-related events

## Events

| Event                                                            | Description                                                     | Documentation                                        |
| ---------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| [cart-created](./cart-created/README.md)                         | Published when a new cart is created                            | [View Details](./cart-created/README.md)             |
| [customer-assigned](./customer-assigned/README.md)               | Published when a customer is assigned to the cart               | [View Details](./customer-assigned/README.md)        |
| [customer-unassigned](./customer-unassigned/README.md)           | Published when a customer is removed from the cart              | [View Details](./customer-unassigned/README.md)      |
| [product-added](./product-added/README.md)                       | Published when a product is added to the cart                   | [View Details](./product-added/README.md)            |
| [product-deleted](./product-deleted/README.md)                   | Published when a product is removed from the cart               | [View Details](./product-deleted/README.md)          |
| [product-updated](./product-updated/README.md)                   | Published when a product quantity is updated in the cart        | [View Details](./product-updated/README.md)          |
| [cart-discount-added](./cart-discount-added/README.md)           | Published when a discount is added to the cart                  | [View Details](./cart-discount-added/README.md)      |
| [cart-discount-removed](./cart-discount-removed/README.md)       | Published when a discount is removed from the cart              | [View Details](./cart-discount-removed/README.md)    |
| [cart-fee-added](./cart-fee-added/README.md)                     | Published when a fee is added to the cart                       | [View Details](./cart-fee-added/README.md)           |
| [cart-fee-removed](./cart-fee-removed/README.md)                 | Published when a fee is removed from the cart                   | [View Details](./cart-fee-removed/README.md)         |
| [product-discount-added](./product-discount-added/README.md)     | Published when a discount is added to a product in the cart     | [View Details](./product-discount-added/README.md)   |
| [product-discount-removed](./product-discount-removed/README.md) | Published when a discount is removed from a product in the cart | [View Details](./product-discount-removed/README.md) |
| [product-fee-added](./product-fee-added/README.md)               | Published when a fee is added to a product in the cart          | [View Details](./product-fee-added/README.md)        |
| [product-fee-removed](./product-fee-removed/README.md)           | Published when a fee is removed from a product in the cart      | [View Details](./product-fee-removed/README.md)      |
| [product-note-added](./product-note-added/README.md)             | Published when a note is added to a product in the cart         | [View Details](./product-note-added/README.md)       |
| [product-note-removed](./product-note-removed/README.md)         | Published when a note is removed from a product in the cart     | [View Details](./product-note-removed/README.md)     |

## Quick Start

### Subscribe to All Cart Events

```typescript
import { topics } from "@final-commerce/command-frame";
import type { TopicEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: TopicEvent) => {
    switch (event.type) {
        case "cart-created":
            console.log("New cart created:", event.data.cart);
            break;
        case "customer-assigned":
            console.log("Customer assigned:", event.data.customer);
            break;
        case "customer-unassigned":
            console.log("Customer removed from cart:", event.data.customer);
            break;
        case "product-added":
            console.log("Product added:", event.data.product);
            break;
        case "product-deleted":
            console.log("Product removed:", event.data.product);
            break;
        case "product-updated":
            console.log("Product updated:", event.data.product);
            break;
        case "product-discount-added":
            console.log("Product discount added:", event.data.discount);
            break;
        case "product-discount-removed":
            console.log("Product discount removed");
            break;
        case "product-fee-added":
            console.log("Product fee added:", event.data);
            break;
        case "product-fee-removed":
            console.log("Product fee removed");
            break;
        case "product-note-added":
            console.log("Product note added");
            break;
        case "product-note-removed":
            console.log("Product note removed");
            break;
        case "cart-discount-added":
            console.log("Discount added:", event.data.discount);
            break;
        case "cart-discount-removed":
            console.log("Discount removed");
            break;
        case "cart-fee-added":
            console.log("Fee added:", event.data.fee);
            break;
        case "cart-fee-removed":
            console.log("Fee removed at index:", event.data.feeIndex);
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
    CartCustomerUnassignedPayload,
    CartCustomerUnassignedEvent,
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
} from "@final-commerce/command-frame";
```

## Related Types

- [`CFActiveCart`](../../../types/README.md#cfactivecart) - Cart type from CommonTypes
- [`CFActiveProduct`](../../../types/README.md#cfactiveproduct) - Product type from CommonTypes
- [`CFCustomer`](../../../types/README.md#cfcustomer) - Customer type from CommonTypes
- [`CFDiscount`](../../../types/README.md#cfdiscount) - Discount type from CommonTypes
- [`CFCustomFee`](../../../types/README.md#cfcustomfee) - Fee type from CommonTypes
- `CartEventType` - Union type of all cart event IDs
- `CartEventPayload` - Union type of all cart event payloads
