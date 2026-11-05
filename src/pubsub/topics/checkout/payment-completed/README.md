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
    sessionResult?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | `string` | The order the payment was made against. |
| `receiptId` | `string` | Human-facing receipt number. Safe to show the shopper. |
| `resultCode` | `string` | The provider's own outcome, typically `Authorised`. |
| `sessionResult` | `string?` | Opaque proof of this payment, handed to the browser by the provider and to nobody else. Pass it to the order-status read. Treat it as a credential. |

### What `sessionResult` is for

It is the only evidence of an outcome that exists **outside** the provider's
webhook. If that webhook is lost, this token is what lets the server ask the
provider directly and repair the order, so send it along when you read the order
back:

```typescript
GET /storefront/customer-order?sessionResult=<token>
X-Order-Password: <the one-time password>
```

The server verifies it with the provider before believing any part of it, and a
status read stays a read: nothing the browser sends can mark an order paid. Do
not log it and do not put it in a URL you share.

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { PaymentCompletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('checkout', (event: PaymentCompletedEvent) => {
    if (event.type === 'payment-completed') {
        // Correct: a confirmation screen the shopper can trust.
        showThankYou(event.data.receiptId);
        // Carry the proof to the status read, so a lost webhook is recoverable.
        rememberSessionResult(event.data.sessionResult);
        // Wrong: markOrderPaid() / releaseDownload() / "Payment received".
    }
});
```

## Related Types

- `PaymentCompletedPayload` - Event payload type
- `PaymentCompletedEvent` - Full event type with topic, type, data, and timestamp
