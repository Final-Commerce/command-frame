# split-payment-updated Event

## Description

Published whenever the host's split-payment slice mutates (a partial tender is appended, the slice is reset on order completion or park, etc.) and once on the command-frame handshake so subscribers can pick up an in-flight session on reconnect.

The host publishes the **full current slice** every time — subscribers can replace their mirror wholesale on every event, with no merge/diff logic required. When no split-payment session is active, the payload's `splitPayment` is `null`.

## Event Type

- **Topic**: `split-payments`
- **Event ID**: `split-payment-updated`

## Payload

```typescript
interface SplitPaymentUpdatedPayload {
    splitPayment: CFSplitPayment | null;
}
```

### Payload Fields

| Field          | Type                                                                     | Description                                                                                                                      |
| -------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `splitPayment` | [`CFSplitPayment`](../../../../types/README.md#cfsplitpayment)` \| null` | The host's full current split-payment session, or `null` when no session is active (initial state or after the slice was reset). |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { SplitPaymentUpdatedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("split-payments", (event: SplitPaymentUpdatedEvent) => {
    if (event.type === "split-payment-updated") {
        const { splitPayment } = event.data;
        if (splitPayment) {
            console.log("Partials so far:", splitPayment.payments);
            console.log("Amount remaining:", splitPayment.amountRemaining);
            console.log("Paid amount:", splitPayment.paidAmount);
        } else {
            console.log("No active split-payment session");
        }
    }
});
```

### Publishing from Render app

Typically you don't publish this event by hand from Render — the host installs a Redux store subscription that publishes the current `splitPayment` slice automatically on every mutation. The example below is for documentation only:

```typescript
import { topicPublisher } from "@render/command-frame";
import type { SplitPaymentUpdatedPayload } from "@final-commerce/command-frame";

topicPublisher.publish("split-payments", "split-payment-updated", {
    splitPayment: currentSlice ?? null
} as SplitPaymentUpdatedPayload);
```

## Lifecycle

The host emits `split-payment-updated`:

1. **On handshake** — once, immediately after the topic publisher is created, with the current slice (often `null`).
2. **On every partial tender captured** — the slice grows by one entry in `payments`.
3. **On reset** — when the order completes (final tender taken) or the cart is parked. Payload's `splitPayment` is `null`.

Subscribers should always replace their mirror with the new payload — never merge — because reset is conveyed by a single event carrying `null`.

## Related Types

- [`CFSplitPayment`](../../../../types/README.md#cfsplitpayment) - In-progress split-payment session type from CommonTypes
- [`CFPaymentMethod`](../../../../types/README.md#cfpaymentmethod) - Individual payment entry type
- `SplitPaymentUpdatedPayload` - Event payload type
- `SplitPaymentUpdatedEvent` - Full event type with topic, type, data, and timestamp
