# customer-unassigned Event (Cart Topic)

## Description

Published when a customer is removed from the current cart/session.

## Event Type

- **Topic**: `cart`
- **Event ID**: `customer-unassigned`

## Payload

```typescript
interface CartCustomerUnassignedPayload {
    customer: CFCustomer;
}
```

### Payload Fields

| Field      | Type                                                   | Description                                         |
| ---------- | ------------------------------------------------------ | --------------------------------------------------- |
| `customer` | [`CFCustomer`](../../../../types/README.md#cfcustomer) | The customer object that was removed from the cart. |

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
import type { CartCustomerUnassignedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("cart", "customer-unassigned", {
    customer: previousCustomer
} as CartCustomerUnassignedPayload);
```

## Related Types

- [`CFCustomer`](../../../../types/README.md#cfcustomer) - Customer type from CommonTypes
- `CartCustomerUnassignedPayload` - Event payload type
- `CartCustomerUnassignedEvent` - Full event type with topic, type, data, and timestamp
