# removeCartDiscount

Removes the cart-level discount from the current cart in the parent application. To apply a discount, use [`addCartDiscount`](../add-cart-discount/README.md).

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

await command.removeCartDiscount();
```

## Behavior

When a cart discount is removed:

1. Any active cart discount is cleared in the parent application, whether or not one was present.
2. Cart totals are recalculated without the cart discount.
3. A `cart-discount-removed` cart event is published, even if there was no discount to remove — see [cart-discount-removed event](../../pubsub/topics/cart/cart-discount-removed/README.md).

In the demo mock, these effects (resetting the mock cart’s `total`, `amountToBeCharged`, and `remainingBalance` to `subtotal`, and publishing the `cart-discount-removed` event) only occur if `MOCK_CART.discount` was set.

## Error Handling

The kaching handler does not throw — it always returns `success: true`, even when there was no cart discount to remove (same idempotent behavior as the demo mock).
