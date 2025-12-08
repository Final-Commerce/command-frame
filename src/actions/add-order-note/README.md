# addOrderNote

Adds a note to the current order/cart.

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

## Error Handling

- Throws an error if parameters are missing

