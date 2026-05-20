# Split Payments Topic

## Overview

The `split-payments` topic mirrors the host's in-progress split-payment session. The host publishes the full current `CFSplitPayment` object (or `null` when no session is active) on every mutation — partial tender captured, slice reset on order completion or park — and once on the command-frame handshake.

Use this topic to drive UI that reflects partial-tender progress (e.g. a cart-payments list, "amount remaining" readouts, paid-amount running totals) without owning the underlying state.

## Topic Information

- **Topic ID**: `split-payments`
- **Name**: Split Payments
- **Description**: Topic for in-progress split-payment session updates

## Events

| Event                                                      | Description                                                                                                                               | Documentation                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [split-payment-updated](./split-payment-updated/README.md) | Published whenever the host's split-payment slice mutates (partial added, reset, etc.); payload carries the full current slice or `null`. | [View Details](./split-payment-updated/README.md) |

## Quick Start

### Subscribe and mirror the slice

```typescript
import { topics } from "@final-commerce/command-frame";
import type { SplitPaymentUpdatedEvent, CFSplitPayment } from "@final-commerce/command-frame";

let splitPayment: CFSplitPayment | null = null;

const subscriptionId = topics.subscribe("split-payments", (event: SplitPaymentUpdatedEvent) => {
    if (event.type === "split-payment-updated") {
        // Replace wholesale — never merge. Host always emits the full current slice
        // (or null when no session is active).
        splitPayment = event.data.splitPayment;
    }
});
```

## Type Safety

All event types are fully typed. Import specific types for better type safety:

```typescript
import type {
    CFSplitPayment,
    SplitPaymentUpdatedPayload,
    SplitPaymentUpdatedEvent,
    SplitPaymentsEventType,
    SplitPaymentsEventPayload
} from "@final-commerce/command-frame";
```

## Lifecycle Notes

- The host emits **once on handshake** so consumers picking up an in-flight session on reconnect get current state immediately rather than waiting for the next mutation.
- The host always publishes the **full current slice**, never deltas. Subscribers replace wholesale; no merge / diff logic is required on the consumer side.
- **Reset is conveyed as a single `split-payment-updated` event with `splitPayment: null`** — typically fired when the final tender completes the order, or when the cart is parked.

## Related Types

- [`CFSplitPayment`](../../../types/README.md#cfsplitpayment) - In-progress split-payment session type
- [`CFPaymentMethod`](../../../types/README.md#cfpaymentmethod) - Individual payment entry within `splitPayment.payments`
- `SplitPaymentsEventType` - Union type of all split-payment event IDs (currently just `"split-payment-updated"`)
- `SplitPaymentsEventPayload` - Union type of all split-payment event payloads
