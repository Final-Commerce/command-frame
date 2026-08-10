# voidOrder

Void or cancel an open order. For orders with captured payment legs, refunds the original tenders atomically; for draft orders, transitions to voided state.

## Parameters

| Name      | Type   | Required | Description                                                 |
| --------- | ------ | -------- | ----------------------------------------------------------- |
| `orderId` | string | No       | Order to void; defaults to the active order.                |
| `reason`  | string | No       | Optional cashier-facing reason. On a pure void, recorded on the void audit row and carried on the `order-voided` event; on the refund branch it rides the event only (the refund dispatcher does not consume it). |

## Response

```typescript
{
  success: boolean;
  orderId: string;
  outcome: "voided" | "refunded";
  timestamp: string;
  transitionResult?: CFTransitionResult;
}
```

### Outcome Semantics

- **`voided`** — nothing was captured; pure state transition to voided × cancelled.
- **`refunded`** — captured split legs were refunded to their original tenders; order lands refunded × cancelled (financially equivalent to a void, but the capture + payout stay on the audit trail).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Void the active order
const result = await command.voidOrder({ reason: 'Customer request' });

// Void a specific order
const result = await command.voidOrder({ orderId: 'order_123', reason: 'Duplicate entry' });
```

## Eligibility

Only open orders (`unpaid`, `payment_pending`, or `partially_paid`) are voidable. Orders in any other payment state — `paid`, `partially_refunded`, `refunded`, `voided`, or unknown — must use the refund flow (`processPartialRefund` or full refund).

### Error Handling

- Throws `ORDER_NOT_VOIDABLE` if the order is in any non-open state (`paid`, `partially_refunded`, `refunded`, `voided`, or unknown) — use the refund flow instead.
- Throws if the order is not found or cannot be transitioned.

## Important Notes

Do **not** emulate a void with `applyTransition` — `voidOrder` keeps the refund-vs-void branching, the financial invariant, and the cart/split cleanup atomic.
