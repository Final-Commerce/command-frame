# customer-unassigned Event (cart topic)

## Description

Published when a customer is removed from the current cart. The payload matches the [`customers` topic `customer-unassigned` event](../../customers/customer-unassigned/README.md) (`CustomerUnassignedPayload`).

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-unassigned`

## Payload

Same as [`CustomerUnassignedPayload`](../../customers/customer-unassigned/README.md#payload):

```typescript
interface CustomerUnassignedPayload {
    customer: CFCustomer;
}
```

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CustomerUnassignedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event: CustomerUnassignedEvent) => {
    if (event.type === 'customer-unassigned') {
        console.log('Customer removed from cart:', event.data.customer);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerUnassignedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('cart', 'customer-unassigned', {
    customer: previousCustomer
} as CustomerUnassignedPayload);
```

## Related Types

- [`CFCustomer`](../../../../types/README.md#cfcustomer)
- [Customers topic: customer-unassigned](../../customers/customer-unassigned/README.md) -- same contract on topic `customers`
