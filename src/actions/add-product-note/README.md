# addProductNote

Adds a note to a specific product line item in the cart.

## Parameters

### `AddProductNoteParams`

```typescript
interface AddProductNoteParams {
    note: string;          // Required
    cartItemId: string;    // Required: The internalId of the cart item to modify
}
```

#### `cartItemId` (required)

The unique `internalId` of the item in the cart you wish to modify. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

#### `note` (required)

The text of the note to add.

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Add note to that specific item
await command.addProductNote({
    cartItemId: internalId,
    note: 'Extra spicy'
});
```
