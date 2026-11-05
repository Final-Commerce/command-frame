# resumeOrder

Loads an order back into the cart — parked or not, paid or not — as long as it isn't already in a cart and isn't finished. The general form of [`resumeParkedOrder`](../resume-parked-order/README.md): same cart rehydration, but the order keeps its state and is marked `inCart.active: true`.

> Full state model in the [Order state machine reference](../../../docs/order-state-machine.md).

## Parameters

`params: ResumeOrderParams`

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `orderId` | `string` | `true`   | The ID of the order to resume. |

## Which orders can be resumed

Everything except:

| Rejected                                                  | Why                                                                                                                                              |
| :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| Already in a cart                                         | `inCart.active` is true — open on this or another station. Legacy orders without the flag count as in a cart while their fulfillment is `draft`. |
| Completed — `paid × fulfilled`                            | Finished.                                                                                                                                        |
| `refunded`, `partially_refunded`, `voided` payment        | Finished.                                                                                                                                        |
| `cancelled`, `returned`, `partially_returned` fulfillment | Finished.                                                                                                                                        |
| `payment_pending`                                         | A payment is still in flight.                                                                                                                    |

So parked orders, drafts set aside with [`releaseFromCart`](../release-from-cart/README.md), orders in the kitchen or out for delivery, and unpaid orders already handed over (pay on delivery) all resume.

## Where the order lands

The order **keeps its state** — being in a cart is `inCart`, not a state. Two exceptions follow the old parked landing:

| From                          | To                                                                           |
| :---------------------------- | :--------------------------------------------------------------------------- |
| `on_hold` (parked) or `draft` | `unpaid × draft` when unpaid, `<payment> × in_progress` once money was taken |
| anything else                 | unchanged                                                                    |

An order with captured money never returns to `draft` (financial invariant `no-draft-regression-with-captured-payments`).

## Editing a resumed order

Items added or removed while the order is in the cart are saved onto it the next time it leaves the cart (payment, park, [`releaseFromCart`](../release-from-cart/README.md), a transition that clears the terminal) — including orders that already took money. An edit can't take the total below what was already paid: that operation is refused until the difference is refunded.

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
// { payment: 'partially_paid', fulfillment: 'on_hold' } → { payment: 'partially_paid', fulfillment: 'in_progress' }  (parked)
// { payment: 'unpaid', fulfillment: 'in_progress' }     → { payment: 'unpaid', fulfillment: 'in_progress' }          (unchanged)
```

## Error Handling

Throws when:

- `orderId` is missing.
- The order is not found (`Order with ID <id> not found`).
- The order is already in a cart (`Order <id> is already in a cart`).
- The order is finished or has a payment in flight (`Order <id> cannot be resumed from <payment> × <fulfillment>`).
- The state machine blocks the transition (the message carries the engine's reason).

## Notes

- **The cart is replaced without confirmation**, exactly like `resumeParkedOrder`. If the cashier has items in the cart, call [`getCurrentCart`](../get-current-cart/README.md) first and [`releaseFromCart`](../release-from-cart/README.md) (or park) before resuming. A saved order the cart held is marked out of the cart (`inCart.active: false`) when the resume succeeds, so it can be resumed again later; unsaved cart contents are lost.
- Split-payment progress on the order (prior legs, remaining balance) is restored along with its items, discounts, fees and customer.
- Amounts are integer minor currency units (e.g. `1575` = $15.75).

## Events

- `cart` / `cart-created` with the resumed cart (`{ cart }`).
- `order-state` / `state-transition-completed` with `{ orderId, from, to, display, timestamp }`.
