# addProductNote

Adds a note to a specific product line item in the cart, or to the current active product context if `internalId` is omitted.

## Parameters

### `AddProductNoteParams`

```typescript
interface AddProductNoteParams {
    note: string;           // Required
    internalId?: string;    // Optional: The internalId of the cart item to modify
}
```

#### `note` (required)

The text of the note to add.

#### `internalId` (optional)

The unique `internalId` of the line item in the cart. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

If omitted, the note is applied to the current active product context instead of a specific cart item. This requires an active product context to already exist — otherwise the call throws.

## Response

### `AddProductNoteResponse`

```typescript
interface AddProductNoteResponse {
    success: boolean;
    note: string;
    internalId?: string;   // Only present when internalId was provided
    timestamp: string;
}
```

## Errors

- Throws `Note is required` if `note` is not provided.
- Throws `Cart item with ID ${internalId} not found` if `internalId` is provided but doesn't match a product in the cart.
- Throws `Adding notes to custom sales is not supported` if `internalId` matches a custom sale line item.
- Throws `No product context. Provide internalId (to update an existing cart item) or use addProductToCart(...) with notes.` if `internalId` is omitted and there is no active product context.

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Add note to that specific item
await command.addProductNote({
    internalId: internalId,
    note: 'Extra spicy'
});
```

## Events

This action publishes a `product-note-added` event on the `cart` topic when a note is successfully added.
