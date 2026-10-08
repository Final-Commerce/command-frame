# setOrderStatus

Sets an order's **custom status** — one of the company's [order statuses](../get-order-statuses/README.md), e.g. `In kitchen`, `Ready for pickup`, `Out for delivery`. Stored on the order as `customStatus: { id, label, setAt, setBy }`, separately from `displayState`, and synced to every station.

A status can be **bound to a fulfillment state**: setting it moves the order there through the normal state machine (same rules as [`applyTransition`](../apply-transition/README.md)). A status can also **require a payment state**: setting it fails until the order has been paid accordingly — a status never moves money; take payment with a payment command first. A status with neither is just a label.

## Parameters

`params: SetOrderStatusParams`

| Parameter  | Type             | Required | Description                                                                                                                                              |
| :--------- | :--------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId`  | `string`         | `false`  | Order to set the status on. Omit for the live cart's order (bound statuses save a cart that isn't an order yet; label-only ones need an existing order). |
| `statusId` | `string \| null` | `true`   | Id from `getOrderStatuses`, or `null` to clear the status (no state change).                                                                             |

## Response

`Promise<SetOrderStatusResponse>`

| Field          | Type                          | Description                                                                |
| :------------- | :---------------------------- | :------------------------------------------------------------------------- |
| `success`      | `boolean`                     |                                                                            |
| `orderId`      | `string`                      |                                                                            |
| `customStatus` | `CFOrderCustomStatus \| null` | `{ id, label, setAt, setBy }` after the call; `null` when cleared.         |
| `from` / `to`  | `CFStatePair \| null`         | State before and after — they differ only when the status moved the order. |
| `order`        | `CFOrder`                     | The order after the call.                                                  |
| `timestamp`    | `string`                      | ISO date string.                                                           |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Kitchen: order is ready
await command.setOrderStatus({ orderId, statusId: 'ready-for-pickup' }); // → in_progress

// Driver: delivered — fails until the order is paid
await command.setOrderStatus({ orderId, statusId: 'delivered' }); // → fulfilled, requires paid

// Kitchen queue
const { orders } = await command.getOrders({ customStatusId: 'in-kitchen' });
```

## Error Handling

Throws when:

- `statusId` isn't one of the company's statuses (`unknown status "<id>"`).
- The order's payment state doesn't meet the status's `requiresPaymentState`.
- The status moves the order and the state machine blocks the move (the message carries the engine's reason).
- The order can't be found, or the live cart has no order and the status is label-only.

## Notes

- **State changes never touch the custom status.** `applyTransition`, payments, refunds and voids move the state only; the status stays as set until `setOrderStatus` changes it. To move the state without changing the label, use `applyTransition`.
- On the live cart's order, a bound status keeps the cart open (it doesn't clear the terminal).
- The label is copied onto the order when set, so renaming a status later doesn't change orders already carrying it.

## Events

- `orders` / `order-updated` with the updated order (and `order-state` / `state-transition-completed` when the status moved the order).
