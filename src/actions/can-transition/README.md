# canTransition

Read-only query: would the order-state-machine allow moving to a given `{ payment, fulfillment }` state pair? Runs the same guard chain the runtime uses to gate real transitions — financial invariants, then cross-axis rules, then path rules, then transition conditions — without mutating anything.

## Parameters

`params: CanTransitionParams`

| Parameter | Type          | Required | Description                                                                                                                                |
| --------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string`      | No       | Order to evaluate. Defaults to the active order; if there is no active order (or none matches), evaluates as a brand-new order (`from = null`). |
| `to`      | `CFStatePair` | Yes      | Target `{ payment, fulfillment }` pair to evaluate.                                                                                          |

## Response

`Promise<CanTransitionResponse>`

```typescript
{
  result: {
    allowed: boolean;
    blockedBy?: "financial_invariant" | "cross_axis_rule" | "path" | "condition";
    guard?: string;
    reason?: string;
    failedConditions?: CFFailedCondition[];
  };
}
```

The engine runs these checks in order and returns on the first hit:

| `blockedBy`            | Meaning                                                                                                | `guard`                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `financial_invariant`   | A hard-coded money-integrity rule was violated (e.g. un-refunding, payment regression, un-voiding).       | id of the violated invariant, e.g. `no-payment-regression`             |
| `cross_axis_rule`       | A configured rule blocking this payment/fulfillment combination (e.g. fulfilling before payment).         | id of the rule, e.g. `require-payment-before-fulfillment-complete`    |
| `path`                  | No `from` state and `to` isn't a valid initial pair, or a configured path rule blocks `from` → `to`.      | not set                                                                |
| `condition`             | Transition conditions configured for this path aren't satisfied.                                          | not set — see `failedConditions` instead                              |

`allowed: true` is the only shape with no other fields set.

## Example

```typescript
import { command } from '@final-commerce/command-frame';

const { result } = await command.canTransition({
  to: { payment: 'refunded', fulfillment: 'cancelled' },
});

if (!result.allowed) {
  showBanner(result.reason ?? 'Transition not allowed');
}
```

## Errors

Throws a plain `Error` (message: `canTransition: invalid target state pair "<JSON>"`) when `to` is missing or either axis isn't a recognized state id. This is the only explicit validation in the handler — an `orderId` that doesn't resolve to an order does not throw; it evaluates as new-order (`from = null`) instead.

## Mock divergence

The standalone mock only recognizes two hardcoded target pairs (`refunded × draft` and `paid × cancelled`) and returns synthetic `guard` ids (`no-refund-in-draft`, `no-pay-cancelled`) that don't correspond to any real invariant or cross-axis-rule id in the runtime engine — it exists to exercise both the allowed and blocked UI branches outside the iframe, not to mirror real guard names.
