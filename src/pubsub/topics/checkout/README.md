# Checkout Topic

## Overview

The `checkout` topic carries the outcome of an **online** checkout on a
published website — the one started by
[`startCheckout`](../../../actions/start-checkout/README.md). Subscribe to it to
learn whether the shopper paid, because `startCheckout` itself cannot tell you:
it resolves as soon as the card fields are mounted, before the shopper has typed
anything.

This is the website counterpart of the [`payments`](../payments/README.md)
topic, and the two never both fire. `payments` reports a till tender settling in
front of a cashier. Online, the shopper's browser can only ever observe an
**authorisation** — the money is confirmed by the provider's capture webhook
reaching the backend, out of band and after the page is done.

## Topic Information

- **Topic ID**: `checkout`
- **Name**: Checkout
- **Description**: Topic for online (website) checkout events
- **Availability**: storefront (website) runtime only

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [checkout-started](./checkout-started/README.md) | The order exists and the payment fields are mounted | [View Details](./checkout-started/README.md) |
| [payment-completed](./payment-completed/README.md) | The shopper's payment succeeded on their side (authorisation, **not** settlement) | [View Details](./payment-completed/README.md) |
| [payment-failed](./payment-failed/README.md) | An attempt was refused or errored; the shopper can retry in place | [View Details](./payment-failed/README.md) |

> A shopper sent through 3-D Secure or a redirect payment method comes back on a
> **fresh page load**, and the outcome is published only once
> [`resumeCheckout`](../../../actions/resume-checkout/README.md) is called on
> that new page. Subscribe first, then call it.

## Quick Start

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('checkout', (event: TopicEvent) => {
    switch (event.type) {
        case 'checkout-started':
            // The server's own price for the cart, in integer minor units.
            console.log('Order', event.data.receiptId, 'due', event.data.serverTotal);
            break;
        case 'payment-completed':
            // Show a confirmation — NOT "payment received", and never a
            // fulfilled/download state. See the event doc for why.
            console.log('Authorised:', event.data.resultCode);
            break;
        case 'payment-failed':
            console.log('Declined:', event.data.resultCode, event.data.message);
            break;
    }
});

// Later:
topics.unsubscribe('checkout', subscriptionId);
```

## Type Safety

```typescript
import type {
    CheckoutStartedPayload,
    CheckoutStartedEvent,
    PaymentCompletedPayload,
    PaymentCompletedEvent,
    PaymentFailedPayload,
    PaymentFailedEvent,
    CheckoutEventType,
    CheckoutEventPayload
} from '@final-commerce/command-frame';
```

## Related

- [`startCheckout`](../../../actions/start-checkout/README.md) — the command that publishes every event here
- [`payments` topic](../payments/README.md) — the till counterpart, which does not fire online
- `CheckoutEventType` - Union type of all checkout event IDs
- `CheckoutEventPayload` - Union type of all checkout event payloads
