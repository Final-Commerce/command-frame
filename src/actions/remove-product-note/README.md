# removeProductNote

Removes the note from a specific product line item in the cart, or from the current active product context if `internalId` is omitted.

## Parameters

### `RemoveProductNoteParams`

```typescript
interface RemoveProductNoteParams {
    internalId?: string;    // Optional: The internalId of the cart item to modify
}
```

#### `internalId` (optional)

The unique `internalId` of the line item in the cart. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

If omitted, the note is removed from the current active product context instead of a specific cart item. This requires an active product context to already exist — otherwise the call throws.

## Response

### `RemoveProductNoteResponse`

```typescript
interface RemoveProductNoteResponse {
    success: boolean;
    internalId?: string;   // Only present when internalId was provided
    timestamp: string;
}
```

## Errors

- Throws `Product with ID ${internalId} not found in cart` if `internalId` is provided but doesn't match a product in the cart.
- Throws `No active product. Provide internalId or use setActiveProduct first.` if `internalId` is omitted and there is no active product context.

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// Remove the note from a specific cart item
await command.removeProductNote({
    internalId: 'abc123'
});

// Remove the note from the current active product context
await command.removeProductNote();
```

## Events

This action publishes a `product-note-removed` event on the `cart` topic when a note is successfully removed.
