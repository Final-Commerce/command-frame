# voidOrder

Void or cancel an order that hasn't been completed: an open order, or a paid order that was never fulfilled (e.g. paid and sent to the kitchen, not yet handed over). For orders with captured payments, refunds the original tenders atomically; for orders with nothing captured, transitions to voided state.

## Parameters

| Name      | Type   | Required | Description                                                                                                                                                                                                                                        |
| --------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | string | No       | Order to void. Omit for the live cart's order — the order in this register's cart (resumed, or part-paid). A finished sale kept for receipts after payment is not the cart's order: pass its `orderId`.                                            |
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
- **`refunded`** — captured payments (a deposit or split legs, or the whole payment of a paid order never fulfilled) were refunded to their original tenders; order lands refunded × cancelled (financially equivalent to a void, but the capture + payout stay on the audit trail).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Void the order in the cart
const result = await command.voidOrder({ reason: 'Customer request' });
if (result.outcome === 'refunded') {
  // captured legs were refunded to their original tenders
}

// Void a specific order
const specific = await command.voidOrder({ orderId: '66b1c2d3e4f5a6b7c8d9e0f1', reason: 'Duplicate entry' });
```

## Eligibility

Two kinds of order are voidable:

- **Open orders** — payment state `unpaid`, `payment_pending`, or `partially_paid`, whatever their fulfillment.
- **Paid orders never fulfilled** — payment state `paid` with fulfillment `draft`, `pending`, or `on_hold` (e.g. paid and sent to the kitchen, not yet handed over). The refund flow rejects these (`refund.partialNotAllowedOnUnfulfilled`), so void is how they are called off: the payment is refunded and the order lands refunded × cancelled.

Every other order — `paid` and already `in_progress` or further, `partially_refunded`, `refunded`, `voided`, or unknown — must use the refund flow (`processPartialRefund` or full refund).

### Error Handling

- Throws `ORDER_NOT_VOIDABLE: order {orderId} is '{paymentState}' — use the refund flow for completed orders` if the order is not voidable (see Eligibility): a paid order already in progress or further, `partially_refunded`, `refunded`, `voided`, or unknown.
- Throws `Order with ID {orderId} not found` if an explicit `orderId` is given and doesn't resolve to an order.
- Throws `No order selected. Please provide orderId.` if no `orderId` is given and the cart holds no order of its own — including right after a sale, when the paid order is kept for receipts but has left the cart. An id-less void never acts on that order: since a paid order still in the kitchen is voidable, it would refund the last customer.
- Throws (message from the blocking guard, or `Void blocked ({guard})` if the guard has no reason) if the state machine blocks the transition for any reason other than captured payments.

## Important Notes

Voiding an order by `orderId` resets the cart only when that order is the one in the cart; voiding a finished sale by id leaves the next sale in the cart alone.

Do **not** emulate a void with `applyTransition` — `voidOrder` keeps the refund-vs-void branching, the financial invariant, and the cart/split cleanup atomic.
