# applyTransition

Move an order's fulfillment axis to a target state via the state-machine orchestrator. This is the low-level transition primitive — `parkOrder`, `voidOrder`, and `resumeParkedOrder` are built on top of it with additional business-flow guarantees (refund-vs-void branching, cart rehydration, etc.); prefer those actions when their behavior fits, and reach for `applyTransition` for moves not covered by a dedicated action.

> Full state model — every state, display label, guard layer, and invariant — in the [Order state machine reference](../../../docs/order-state-machine.md).

## Parameters

| Name                     | Type    | Required | Description                                                                                                                                                                                                          |
| ------------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId`                | string  | No       | Order to transition. Omit to target the active order — materializing one from the live cart if none exists yet.                                                                                                      |
| `targetFulfillmentState` | string  | Yes      | Target fulfillment state. The payment axis is never client-settable — it's derived by the engine.                                                                                                                    |
| `clearTerminal`          | boolean | No       | Clear the terminal (cart, split payment, active-order slot) after transitioning the ACTIVE order — park parity. Default `true`. Ignored for non-active (by-id) targets; their terminal is left untouched either way. |

## Response

```typescript
{
  result: {
    allowed: boolean;
    blockedBy?: "financial_invariant" | "cross_axis_rule" | "path" | "condition";
    guard?: string;
    reason?: string;
    failedConditions?: CFFailedCondition[];
  };
  from?: { payment: string; fulfillment: string };  // present only when applied
  to?: { payment: string; fulfillment: string };    // present only when applied
  displayState?: string;                            // present only when applied
}
```

`from`, `to`, and `displayState` are omitted when `result.allowed` is `false` — a blocked transition returns `result` only.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Move the active order to "in_progress"
const result = await command.applyTransition({ targetFulfillmentState: 'in_progress' });

if (result.result.allowed) {
  console.log(result.displayState); // e.g. "In progress"
} else {
  console.log(result.result.reason); // e.g. "Cannot transition an empty cart — add items or target an existing order"
}

// Target a specific persisted order (that order's terminal is untouched)
await command.applyTransition({ orderId: 'order_123', targetFulfillmentState: 'fulfilled' });
```

## Error Handling

A blocked transition is **not** an error — it resolves with `result.allowed = false` plus `blockedBy` / `guard` / `reason` (and `failedConditions` for condition failures). `applyTransition` throws only for:

- An invalid or missing `targetFulfillmentState` — not a recognized fulfillment state.
- A non-active `orderId` that can't be resolved to a persisted order (`Order <id> not found`).

## Important Notes

- If no order exists yet and `unpaid × <target>` isn't a valid initial state, the order is first materialized at `unpaid × pending`, then transitioned to the target — one call, two engine transitions, two audit rows. If the second hop is blocked, the order stays materialized at `unpaid × pending` (not rolled back).
- Transitioning with no order and an empty cart (no line items, no cart fees) is blocked (`blockedBy: "financial_invariant"`, `guard: "empty-cart"`) rather than materializing an empty order.
- `clearTerminal` only ever fires for the ACTIVE order. Transitioning a different order by id leaves the cashier's cart, split payment, and active-order slot exactly as they were.
- Amounts anywhere in the surrounding order/cart context are integer minor currency units (e.g. `1575` = $15.75), never decimals.
