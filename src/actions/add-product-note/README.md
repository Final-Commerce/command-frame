# addProductNote

Adds a note to the currently active product in the cart.

## Parameters

- `note` (string, required): The note text to add to the product

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

// Add a note to the active product
await command.addProductNote({
  note: 'Customer requested extra packaging'
});
```

## Requirements

- A product must be set as active using `setProductActive` before adding a note

## Error Handling

- Throws an error if parameters are missing
- Throws an error if no product is currently active

