# checkout-started Event

## Description

Published when [`startCheckout`](../../../../actions/start-checkout/README.md)
has created the order and mounted the payment fields. The order exists and is
**unpaid** — this is the beginning of a checkout, not the end of one.

## Event Type

- **Topic**: `checkout`
- **Event ID**: `checkout-started`

## Payload

```typescript
interface CheckoutStartedPayload {
    orderId: string;
    receiptId: string;
    serverTotal: number;
    currency: string;
    paymentStatus: "ready" | "unavailable";
    orderPassword?: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | `string` | The created order's id. |
| `receiptId` | `string` | Human-facing receipt number, e.g. `ON-004-000173`. Safe to show the shopper. |
| `serverTotal` | `number` | The **server's** price for the cart, in integer minor units (`5175` = $51.75). The browser never sends a price, so this is the only authoritative total — display it rather than a total your own code summed. |
| `currency` | `string` | ISO 4217 code. |
| `paymentStatus` | `"ready" \| "unavailable"` | `ready` — the shopper can pay now. `unavailable` — the order exists but payment could not be started, so the shopper has **not** been charged. Not a failed order. |
| `orderPassword` | `string?` | One-time password for reading this order back. Present **only on the first create**; there is no way to retrieve it later. |

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { CheckoutStartedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('checkout', (event: CheckoutStartedEvent) => {
    if (event.type === 'checkout-started') {
        setReceiptId(event.data.receiptId);
        setAmountDue(event.data.serverTotal, event.data.currency);
        if (event.data.paymentStatus === 'unavailable') {
            // Say the order exists and payment could not be started.
            showMessage('Your order was created, but we could not start payment.');
        }
    }
});
```

## Notes

- The same information is also the resolved value of `startCheckout`, so a page that awaits the call does not need this event. It exists so that other parts of a page (an order summary, an analytics hook) can react without threading the result through.

## Related Types

- `CheckoutStartedPayload` - Event payload type
- `CheckoutStartedEvent` - Full event type with topic, type, data, and timestamp
