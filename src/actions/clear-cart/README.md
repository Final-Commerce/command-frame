# clearCart

Clears all items from the current cart and resets cart-related state.

## Parameters

None

## Response

```typescript
{
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Clear the cart
await command.clearCart();
```

## Notes

- If the cart holds an order that was already saved (e.g. one loaded with [`resumeOrder`](../resume-order/README.md)), that order is **not** deleted: it keeps its last saved contents — changes made in the cart since are discarded — and is marked out of the cart (`order.inCart.active: false`), so it can be resumed again. To keep the cart's changes, use [`releaseFromCart`](../release-from-cart/README.md) instead; to cancel the order, use [`voidOrder`](../void-order/README.md).

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `clearCart: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.

## Events

- Publishes a `cart-created` event on the `cart` topic with the reset cart
- Publishes a `product-deleted` event on the `cart` topic for each product that was in the cart, with `{ product, internalId }` (skipped if the cart was already empty)

## Error Handling

None (always succeeds)
