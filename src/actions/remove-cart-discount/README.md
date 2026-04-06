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

1. Any active cart discount is cleared in the parent application.
2. Cart totals are recalculated from the subtotal without the cart discount.

In the demo mock, if a discount was present, the mock cart’s `total`, `amountToBeCharged`, and `remainingBalance` are reset to `subtotal`, and a `cart-discount-removed` cart event is published.

## Error Handling

Depends on the parent handler. The demo mock always returns `success: true`, including when there was no cart discount to remove.
