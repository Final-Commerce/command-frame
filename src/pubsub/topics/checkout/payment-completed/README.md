# payment-completed Event

## Description

Published when the shopper's payment succeeds **on their side** — they entered a
card and the provider accepted it.

**This is an authorisation, not a settlement.** Under manual capture the
provider reports `Authorised` and the money is confirmed only when its capture
webhook reaches the backend, out of band and after this page is finished. A
browser cannot observe that, which is exactly why this event carries a
`resultCode` instead of a boolean "paid".

Show a confirmation on this event. Do **not** claim "payment received", release
a download, unlock content, or mark anything fulfilled — read the order back
with the `orderPassword` from
[`checkout-started`](../checkout-started/README.md) for the settled state.

## Event Type

- **Topic**: `checkout`
- **Event ID**: `payment-completed`

## Payload

```typescript
interface PaymentCompletedPayload {
    orderId: string;
    receiptId: string;
    resultCode: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | `string` | The order the payment was made against. |
| `receiptId` | `string` | Human-facing receipt number. Safe to show the shopper. |
| `resultCode` | `string` | The provider's own outcome, typically `Authorised`. |

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { PaymentCompletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('checkout', (event: PaymentCompletedEvent) => {
    if (event.type === 'payment-completed') {
        // Correct: a confirmation screen the shopper can trust.
        showThankYou(event.data.receiptId);
        // Wrong: markOrderPaid() / releaseDownload() / "Payment received".
    }
});
```

## Related Types

- `PaymentCompletedPayload` - Event payload type
- `PaymentCompletedEvent` - Full event type with topic, type, data, and timestamp
