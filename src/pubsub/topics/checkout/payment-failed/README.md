# payment-failed Event

## Description

Published when a payment attempt is refused by the provider, or errors before it
completes.

**One declined attempt is not a dead checkout.** The order still exists and the
payment fields stay mounted, so the shopper can try another card in place. Do
not tear down the checkout, start a new one, or tell the shopper their order
failed — show the message and let them retry.

## Event Type

- **Topic**: `checkout`
- **Event ID**: `payment-failed`

## Payload

```typescript
interface PaymentFailedPayload {
    orderId: string;
    receiptId: string;
    resultCode: string;
    message?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | `string` | The order the attempt was made against. |
| `receiptId` | `string` | Human-facing receipt number. |
| `resultCode` | `string` | The provider's result code (e.g. `Refused`) or an error name (e.g. `NETWORK_ERROR`). |
| `message` | `string?` | Present when the failure carried a message worth showing. |

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { PaymentFailedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('checkout', (event: PaymentFailedEvent) => {
    if (event.type === 'payment-failed') {
        // Keep the mounted fields; the shopper retries right there.
        showRetryMessage(event.data.message ?? 'That card was declined. Please try another.');
    }
});
```

## Related Types

- `PaymentFailedPayload` - Event payload type
- `PaymentFailedEvent` - Full event type with topic, type, data, and timestamp
