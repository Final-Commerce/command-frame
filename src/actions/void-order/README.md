# voidOrder

Void or cancel an open order. For orders with captured payment legs, refunds the original tenders atomically; for draft orders, transitions to voided state.

## Parameters

| Name      | Type   | Required | Description                                                                                                                                                                                                                                        |
| --------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | string | No       | Order to void; defaults to the active order.                                                                                                                                                                                                       |
| `reason`  | string | No       | Optional cashier-facing reason. Recorded on both branches — the void audit trail on a pure void, and (verbatim) on the persisted refund plus its own audit trail on the refund branch — and always carried on the `order-voided` event either way. |

## Response

```typescript
{
  success: boolean;
  orderId: string;
  outcome: 'voided' | 'refunded';
  timestamp: string;
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
if (result.outcome === 'refunded') {
  // captured legs were refunded to their original tenders
}

// Void a specific order
const specific = await command.voidOrder({ orderId: '66b1c2d3e4f5a6b7c8d9e0f1', reason: 'Duplicate entry' });
```

## Eligibility

Only open orders (`unpaid`, `payment_pending`, or `partially_paid`) are voidable. Orders in any other payment state — `paid`, `partially_refunded`, `refunded`, `voided`, or unknown — must use the refund flow (`processPartialRefund` or full refund).

### Error Handling

- Throws `ORDER_NOT_VOIDABLE: order {orderId} is '{paymentState}' — use the refund flow for completed orders` if the order is in any non-open state (`paid`, `partially_refunded`, `refunded`, `voided`, or unknown).
- Throws `Order with ID {orderId} not found` if an explicit `orderId` is given and doesn't resolve to an order.
- Throws `No order selected. Please provide orderId.` if no `orderId` is given and there is no active order.
- Throws (message from the blocking guard, or `Void blocked ({guard})` if the guard has no reason) if the state machine blocks the transition for any reason other than captured payments.

## Important Notes

Do **not** emulate a void with `applyTransition` — `voidOrder` keeps the refund-vs-void branching, the financial invariant, and the cart/split cleanup atomic.
