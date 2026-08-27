# removeOrderNote

Clears the note from the current order/cart.

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

// Clear the order note
await command.removeOrderNote();
```

## Events

- Publishes a `cart-created` event on the `cart` topic with the updated cart

## Error Handling

None (always succeeds)
