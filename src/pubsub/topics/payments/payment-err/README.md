# payment-err Event

## Description

Published when a payment error occurs.

## Event Type

- **Topic**: `payments`
- **Event ID**: `payment-err`

## Payload

```typescript
interface PaymentErrPayload {
    error: string;
    errorCode?: string;
    paymentType?: string;
    amount?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `error` | `string` | The error message describing what went wrong. |
| `errorCode` | `string` | Optional error code for programmatic handling. |
| `paymentType` | `string` | Optional payment type (e.g., 'cash', 'terminal', 'tapToPay'). |
| `amount` | `string` | Optional payment amount that failed. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { PaymentErrEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('payments', (event: PaymentErrEvent) => {
    if (event.type === 'payment-err') {
        console.error('Payment error:', event.data.error);
        console.error('Error code:', event.data.errorCode);
        // Show error notification to user
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { PaymentErrPayload } from '@final-commerce/command-frame';

// When a payment error occurs
topicPublisher.publish('payments', 'payment-err', {
    error: errorMessage,
    errorCode: errorCode,
    paymentType: paymentType,
    amount: amount
} as PaymentErrPayload);
```

## Related Types

- `PaymentErrPayload` - Event payload type
- `PaymentErrEvent` - Full event type with topic, type, data, and timestamp

