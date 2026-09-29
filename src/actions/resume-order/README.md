# resumeOrder

Loads any open order back into the cart — parked or not. The general form of [`resumeParkedOrder`](../resume-parked-order/README.md): same cart rehydration and state transition, but eligibility is decided by the order's state pair instead of whether it was parked.

> Full state model in the [Order state machine reference](../../../docs/order-state-machine.md).

## Parameters

`params: ResumeOrderParams`

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `orderId` | `string` | `true`   | The ID of the order to resume. |

## Which orders can be resumed

An order resumes when **both** axes are open:

| Axis        | Resumable                                                  | Rejected                                                                               |
| :---------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| Payment     | `unpaid`, `partially_paid`, `paid`                         | `payment_pending` (a payment is in flight), `partially_refunded`, `refunded`, `voided` |
| Fulfillment | `pending`, `on_hold`, `in_progress`, `partially_fulfilled` | `draft` (already the cart), `fulfilled`, `partially_returned`, `returned`, `cancelled` |

So _Parked_, _Pending Payment_, _Deposit Received_, _Partially Paid_ and _Paid - Awaiting Fulfillment_ resume; _In Cart_, _Completed_, _Refunded_ and _Cancelled_ do not.

## Where the order lands

| From                                                  | To                                            |
| :---------------------------------------------------- | :-------------------------------------------- |
| `unpaid × *`                                          | `unpaid × draft` (In Cart)                    |
| money captured, `pending` / `on_hold`                 | `<payment> × in_progress`                     |
| money captured, `in_progress` / `partially_fulfilled` | unchanged — fulfillment never moves backwards |

An order with captured money never returns to `draft` (financial invariant `no-draft-regression-with-captured-payments`).

## Response

`Promise<ResumeOrderResponse>`

| Field       | Type          | Description                                      |
| :---------- | :------------ | :----------------------------------------------- |
| `success`   | `boolean`     | `true` if the order was resumed.                 |
| `order`     | `CFOrder`     | The resumed order, re-read after the transition. |
| `from`      | `CFStatePair` | `{ payment, fulfillment }` before resuming.      |
| `to`        | `CFStatePair` | `{ payment, fulfillment }` after resuming.       |
| `timestamp` | `string`      | ISO date string of when the action occurred.     |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.resumeOrder({ orderId: 'order-id-123' });
console.log(result.from, '→', result.to);
// { payment: 'partially_paid', fulfillment: 'pending' } → { payment: 'partially_paid', fulfillment: 'in_progress' }
```

## Error Handling

Throws when:

- `orderId` is missing.
- The order is not found (`Order with ID <id> not found`).
- The order's state isn't resumable (`Order <id> cannot be resumed from <payment> × <fulfillment>`).
- The state machine blocks the transition (the message carries the engine's reason).

## Notes

- **The cart is replaced without confirmation**, exactly like `resumeParkedOrder`. If the cashier has items in the cart, call [`getCurrentCart`](../get-current-cart/README.md) first and park or confirm before resuming.
- Split-payment progress on the order (prior legs, remaining balance) is restored along with its items, discounts, fees and customer.
- Amounts are integer minor currency units (e.g. `1575` = $15.75).

## Events

- `cart` / `cart-created` with the resumed cart (`{ cart }`).
- `order-state` / `state-transition-completed` with `{ orderId, from, to, display, timestamp }`.
