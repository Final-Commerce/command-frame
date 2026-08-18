# addOrderNote

Adds a note to the current order/cart. This replaces any existing order note — the cart holds a single note field, not an accumulating list.

## Parameters

- `note` (string, required): The note text to add to the order

## Response

```typescript
{
  success: boolean;
  note: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Add a note to the order
await command.addOrderNote({
  note: 'Customer requested delivery by 3pm'
});
```

## Events

- Publishes a `cart-created` event on the `cart` topic with the updated cart

## Error Handling

- Throws `Error('Note is required')` if `note` is missing or an empty string

