# releaseFromCart

Takes the order in the cart **out of the cart without changing it**, and clears the terminal for the next sale. The order keeps its payment and fulfillment state — nothing is parked, paid or voided — and is saved with `inCart.active: false`, so it can be picked up again later with [`resumeOrder`](../resume-order/README.md), on this station or another.

Use it instead of [`clearCart`](../clear-cart/README.md) when the order should survive: `clearCart` discards the cart (and, for an order that was already saved, leaves it marked as in a cart). Use [`voidOrder`](../void-order/README.md) to cancel an order for good.

## Parameters

None — it acts on the live cart.

## Response

`Promise<ReleaseFromCartResponse>`

| Field       | Type      | Description                                                          |
| :---------- | :-------- | :------------------------------------------------------------------- |
| `success`   | `boolean` | `true` if the order was saved and the cart cleared.                  |
| `order`     | `CFOrder` | The order as saved: state unchanged, `inCart: { active: false, … }`. |
| `timestamp` | `string`  | ISO date string of when the action occurred.                         |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Set the current order aside and start the next one
const { order } = await command.releaseFromCart();

// Later — from this station or another
const { orders } = await command.getOrders({ inCart: false, fulfillmentState: ['draft', 'pending', 'in_progress'] });
await command.resumeOrder({ orderId: order._id });
```

## Behaviour

- **A cart that isn't an order yet** is saved as a new unpaid draft (`unpaid × draft`), then released.
- **An order already in the cart** (resumed, or partly paid) is saved with the cart's current contents — items added or removed since it was loaded are kept — and released.
- An order that already took money can't be edited below what was paid: if the cart total is lower than the amount already paid, the release is refused (refund the difference first).

## Error Handling

Throws when:

- The cart is empty and holds no order (`releaseFromCart: the cart is empty`).
- The cart total is below what the order already paid (`… refund the difference first`).
- The state machine blocks the save (the message carries the engine's reason).

## Events

- `orders` / `order-updated` (or `order-created` for a new order) with the saved order.
- `cart` / `cart-created` with the fresh empty cart once the terminal is reset (the same event `clearCart` produces).
