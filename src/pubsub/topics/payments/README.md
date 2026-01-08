# Payments Topic

## Overview

The `payments` topic provides events related to payment processing. Subscribe to this topic to receive real-time notifications when payments are completed or when payment errors occur.

## Topic Information

- **Topic ID**: `payments`
- **Name**: Payments
- **Description**: Topic for payment-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [payment-done](./payment-done/README.md) | Published when a payment is successfully completed | [View Details](./payment-done/README.md) |
| [payment-err](./payment-err/README.md) | Published when a payment error occurs | [View Details](./payment-err/README.md) |

## Quick Start

### Subscribe to All Payment Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('payments', (event: TopicEvent) => {
    switch (event.type) {
        case 'payment-done':
            console.log('Payment completed:', event.data.payment);
            break;
        case 'payment-err':
            console.error('Payment error:', event.data.error);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    PaymentDonePayload,
    PaymentDoneEvent,
    PaymentErrPayload,
    PaymentErrEvent,
    PaymentsEventType,
    PaymentsEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFPaymentMethod` - Payment method type from CommonTypes
- `CFOrder` - Order type from CommonTypes
- `PaymentsEventType` - Union type of all payment event IDs
- `PaymentsEventPayload` - Union type of all payment event payloads

