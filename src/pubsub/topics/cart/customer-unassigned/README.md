# customer-unassigned Event (Cart Topic)

## Description

Published when a customer is removed from the current cart. The payload matches the [`customers` topic `customer-unassigned`](../../customers/customer-unassigned/README.md) event (`CustomerUnassignedPayload`).

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-unassigned`

## Payload

```typescript
interface CustomerUnassignedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field      | Type                                                   | Description                                  |
| ---------- | ------------------------------------------------------ | -------------------------------------------- |
| `customer` | [`CFCustomer`](../../../../types/README.md#cfcustomer) | The customer that was removed from the cart. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { CartCustomerUnassignedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: CartCustomerUnassignedEvent) => {
    if (event.type === "customer-unassigned") {
        console.log("Customer removed from cart:", event.data.customer);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { CustomerUnassignedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "customer-unassigned", {
    customer: previousCustomer
} as CustomerUnassignedPayload);
```

## Related Types

- `CartCustomerUnassignedPayload` — Alias of `CustomerUnassignedPayload` for cart subscriptions
- `CartCustomerUnassignedEvent` — Full event type (`topic`, `type`, `data`, `timestamp`)
