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

## Error Handling

None (always succeeds)

