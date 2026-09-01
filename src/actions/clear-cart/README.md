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

## Events

- Publishes a `cart-created` event on the `cart` topic with the reset cart
- Publishes a `product-deleted` event on the `cart` topic for each product that was in the cart, with `{ product, internalId }` (skipped if the cart was already empty)

## Error Handling

None (always succeeds)
