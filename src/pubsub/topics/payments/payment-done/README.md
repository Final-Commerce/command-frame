# payment-done Event

## Description

Fired when a payment is successfully completed.

## Event Type

- **Topic**: `payments`
- **Event ID**: `payment-done`

## Payload

```typescript
interface PaymentDonePayload {
    payment: CFPaymentMethod;
    order: CFOrder;
    amount: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `payment` | `CFPaymentMethod` | The payment method object with transaction details, payment type, amount, timestamp, etc. |
| `order` | `CFOrder` | The order object associated with this payment. |
| `amount` | `string` | The payment amount as a string. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { PaymentDoneEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('payments', (event: PaymentDoneEvent) => {
    if (event.type === 'payment-done') {
        console.log('Payment completed:', event.data.payment);
        console.log('Order:', event.data.order);
        console.log('Amount:', event.data.amount);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { PaymentDonePayload } from '@final-commerce/command-frame';

// When a payment is completed
topicPublisher.publish('payments', 'payment-done', {
    payment: paymentMethod,
    order: order,
    amount: amount
} as PaymentDonePayload);
```

## Related Types

- `CFPaymentMethod` - Payment method type from CommonTypes
- `CFOrder` - Order type from CommonTypes
- `PaymentDonePayload` - Event payload type
- `PaymentDoneEvent` - Full event type with topic, type, data, and timestamp

