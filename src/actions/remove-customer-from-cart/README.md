# removeCustomerFromCart

Removes the currently assigned customer from the cart.

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

// Remove customer from cart
await command.removeCustomerFromCart();
```

## Error Handling

None (always succeeds, even if no customer is assigned)

