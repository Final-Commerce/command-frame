# customer-unassigned Event (cart topic)

## Description

Published when a customer is removed from the current cart. This is the same **`customer-unassigned`** event type as on the [`customers`](../../customers/README.md) topic; hosts may publish it on **`cart`** when cart-centric subscribers should react without subscribing to the full customers feed.

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-unassigned`

## Payload

Uses [`CustomerUnassignedPayload`](../../customers/customer-unassigned/README.md#payload) from the customers topic (`customer`).

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerUnassignedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CustomerUnassignedEvent) => {
    if (event.type === 'customer-unassigned') {
        console.log('Customer removed from cart:', event.data.customer);
    }
});
```

## Related Types

- [`CustomerUnassignedPayload`](../../customers/customer-unassigned/README.md) / `CustomerUnassignedEvent`
- [`CFCustomer`](../../../../types/README.md#cfcustomer)
