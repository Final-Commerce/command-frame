# customer-unassigned Event

## Description

Published when a customer is removed from the cart (same event id as on the `customers` topic; also listed under the `cart` topic for cart-focused subscribers).

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-unassigned`

## Payload

Same payload shape as the [`customers` topic `customer-unassigned`](../../customers/customer-unassigned/README.md) event (types are re-exported from `@final-commerce/command-frame`).

```typescript
interface CustomerUnassignedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field      | Type                                                   | Description                                     |
| ---------- | ------------------------------------------------------ | ----------------------------------------------- |
| `customer` | [`CFCustomer`](../../../../types/README.md#cfcustomer) | The customer that was unassigned from the cart. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { CustomerUnassignedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("cart", (event: CustomerUnassignedEvent) => {
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
    customer
} as CustomerUnassignedPayload);
```

## Related Types

- [`CFCustomer`](../../../../types/README.md#cfcustomer) - Customer type from CommonTypes
- See also: [customers topic customer-unassigned](../../customers/customer-unassigned/README.md)
