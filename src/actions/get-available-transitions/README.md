# getAvailableTransitions

Read-only query: given an order's current `{ payment, fulfillment }` state, return every target state pair reachable in **one step** that the order-state-machine would currently allow. Internally this runs the same guard chain as `canTransition` (financial invariants, then cross-axis rules, then path rules, then transition conditions) for each candidate pair and keeps only the ones that pass — nothing is mutated.

> Full state model — every state, display label, guard layer, and invariant — in the [Order state machine reference](../../../docs/order-state-machine.md).

## Parameters

`params: GetAvailableTransitionsParams`

| Parameter | Type     | Required | Description                                                                                                                                                                                                       |
| --------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string` | Yes      | Order to evaluate. Resolved against the in-memory active order first (if its id matches); otherwise looked up from the database. Unlike `canTransition`, this is **not optional** — there is no "new order" mode. |

## Response

`Promise<GetAvailableTransitionsResponse>`

```typescript
{
  transitions: Array<{
    to: { payment: string; fulfillment: string };
    displayLabel: string;
    conditions: { met: boolean; description: string }[];
  }>;
}
```

The current state is read from the order's explicit `paymentState`/`fulfillmentState` fields, falling back to inference from the legacy `status` field. Evaluation uses the outlet's current resolved state-machine config (its cross-axis rules, condition sets, and valid-initial-state list — not just platform defaults) and an order context that also accounts for any split payment currently in progress.

A candidate is only included after it has already passed the condition check — but that check (`canTransition`) evaluates the condition set as OR-of-AND-groups, allowing the transition once _any one_ group passes. The `conditions` array attached to the response, however, is built separately: it walks _every_ group's conditions unconditionally and records `met: r.ok` for each one individually, without filtering to the group that actually passed. So for a condition set with multiple OR-alternative groups, an included transition's `conditions` array can mix `met: true` lines from the passing group with `met: false` lines from a failing one — it's not a guarantee that every line is satisfied, and callers shouldn't treat it as a pure audit trail of "things that were checked and passed". (Compare `canTransition`, which surfaces `failedConditions` for a pair that's blocked.)

## Example

```typescript
import { command } from '@final-commerce/command-frame';

const { transitions } = await command.getAvailableTransitions({ orderId: currentOrder._id });

transitions.forEach((t) => {
  renderActionButton(t.displayLabel, () => applyTransition(t.to));
});
```

## Errors

Throws a plain `Error` in two cases:

- `getAvailableTransitions: orderId is required` — `orderId` was missing/empty.
- `getAvailableTransitions: order <orderId> not found` — the order couldn't be resolved (no active order matches and no persisted order exists with that id), or it was found but its current state pair couldn't be determined.

## Mock divergence

The standalone mock returns a fixed set of five transitions modeled on a freshly-created unpaid order, so the demo app always has data to render regardless of what order (if any) is active. Its void-order entry includes a condition with `met: false` — the mock's own comment flags this as "skipped" for simplicity, but per the caveat above a `met: false` line on an included transition isn't actually unrealistic; the real engine can produce the same mix when a multi-group condition set is satisfied by one group but not another.
