# order-voided Event

## Description

Published when an open order is voided (pure void, or captured legs refunded).

For complete type reference, see [Types Reference](../../../../types/README.md).

## Event Type

- **Topic**: `orders`
- **Event ID**: `order-voided`

## Payload

```typescript
interface OrderVoidedPayload {
  orderId: string;
  outcome: 'voided' | 'refunded';
  reason?: string;
}
```

### Payload Fields

| Field     | Type                     | Description                                                                              |
| --------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `orderId` | `string`                 | The ID of the order being voided.                                                        |
| `outcome` | `"voided" \| "refunded"` | Void outcome: `"voided"` = nothing captured; `"refunded"` = captured legs were refunded. |
| `reason`  | `string`                 | Optional reason for the void.                                                            |

## Publishing

Fires from `voidOrder` only. The `refunded` outcome is additionally followed by the existing `refund-created` on the `refunds` topic.

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { OrderVoidedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('orders', (event: OrderVoidedEvent) => {
  if (event.type === 'order-voided') {
    console.log('Order voided:', event.data.orderId, 'outcome:', event.data.outcome);
  }
});
```

## Related Events

- `refund-created` on `refunds` topic — published when the `refunded` outcome also triggers a refund operation
