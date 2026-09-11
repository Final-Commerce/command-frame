# loadOrderIntoCart

Puts a saved, till-eligible order on the till with **all** of its cart context — line items, custom sales, cart fees, discounts, notes, split/partial-payment state + remaining balance, customer, and signature — and pins it as the active order. Optionally moves the order's fulfillment state first (one call for the "resume" recipe).

This is the rails replacement for `resumeParkedOrder`'s hydration half. State moves belong to [`applyTransition`](../apply-transition/README.md); the optional `targetFulfillmentState` here is the same engine call, run before hydration — a blocked move aborts the whole load.

**Till eligibility:** payment `unpaid` or `partially_paid`, fulfillment not `cancelled` (there is still a balance to take). Anything else is [`setActiveOrder`](../set-active-order/README.md) territory (point at an order for receipts, refunds, voids, viewing — never claims the till).

**Edit lock:** the cart lease blocks *content modification only*. A foreign hold never blocks loading, viewing, payment, or transitions — the response's `editable` flag says whether this till may modify the cart.

## Parameters

`params: LoadOrderIntoCartParams`

| Parameter                | Type      | Required | Description                                                                                                                                 |
| :----------------------- | :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `orderId`                | `string`  | `true`   | The saved order to load.                                                                                                                     |
| `targetFulfillmentState` | `string`  | `false`  | Fulfillment target applied before hydration (e.g. `'draft'` for an unpaid parked order, `'in_progress'` for a deposit-carrying one). A blocked move aborts the load. |
| `overwrite`              | `boolean` | `false`  | The till already holding cart content is an error unless this is `true`.                                                                     |

## Response

`Promise<LoadOrderIntoCartResponse>`

| Field        | Type                          | Description                                                                                  |
| :----------- | :---------------------------- | :-------------------------------------------------------------------------------------------- |
| `success`    | `boolean`                     | `true` when the order was loaded.                                                             |
| `order`      | `CFOrder`                     | The loaded order (post-transition when a target was applied).                                 |
| `cart`       | `CFActiveCart`                | The hydrated till state.                                                                      |
| `editable`   | `boolean`                     | Whether this till holds edit rights (the cart lease).                                         |
| `lease`      | `LoadOrderIntoCartLeaseInfo?` | Who holds the lease, when one exists (ships with the occupancy follow-up).                    |
| `transition` | `object?`                     | Present when `targetFulfillmentState` was passed: the verdict, plus `from`/`to`/`displayState` when applied. |
| `timestamp`  | `string`                      | ISO date string of when the action occurred.                                                  |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Resume an unpaid parked order (state move + hydration in one call)
const result = await command.loadOrderIntoCart({
  orderId: 'order-id-123',
  targetFulfillmentState: 'draft',
});
console.log('Loaded order:', result.order, 'editable:', result.editable);

// Load a deposit-carrying order to settle its balance ('draft' is blocked once money moved)
await command.loadOrderIntoCart({
  orderId: 'order-id-456',
  targetFulfillmentState: 'in_progress',
  overwrite: true,
});
```

## Recipes

| Intent                       | Call                                                                          |
| :--------------------------- | :---------------------------------------------------------------------------- |
| Resume unpaid parked order   | `loadOrderIntoCart({ orderId, targetFulfillmentState: 'draft' })`             |
| Resume deposit-carrying order| `loadOrderIntoCart({ orderId, targetFulfillmentState: 'in_progress' })`       |
| Load without a state change  | `loadOrderIntoCart({ orderId })`                                              |
| Put it back when done        | `applyTransition({ targetFulfillmentState: 'on_hold' })`                      |
| Point at it without the till | `setActiveOrder({ orderId })`                                                 |
