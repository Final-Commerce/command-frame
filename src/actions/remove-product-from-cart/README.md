# removeProductFromCart

Removes a product from the cart by its unique `internalId`. This action is useful for removing specific cart items when you know the exact cart item identifier.

## Parameters

### `RemoveProductFromCartParams`

```typescript
interface RemoveProductFromCartParams {
    internalId: string;  // The unique identifier for the specific cart item to remove
}
```

#### `internalId` (required)

The unique identifier for the specific cart item instance to remove. This is the `internalId` returned when the product was originally added to the cart via `addProductToCart`.

## Response

### `RemoveProductFromCartResponse`

```typescript
interface RemoveProductFromCartResponse {
    success: boolean;
    internalId: string;  // The unique identifier of the removed cart item
    timestamp: string;
}
```

## Usage Examples

### Remove Product from Cart

Remove a product using its internal ID:

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.removeProductFromCart({
    internalId: 'cart-item-internal-id-123'
});

console.log(`Removed item with internal ID: ${result.internalId}`);
```

### Error Handling

```typescript
try {
    await command.removeProductFromCart({ internalId: 'invalid-id' });
} catch (error) {
    console.error('Cart item not found:', error.message);
}
```

## Events

This action publishes a `product-deleted` event on the `cart` topic when a product is successfully removed.

## Related Actions

- `addProductToCart` - Add a product to the cart (returns `internalId`)
- `updateCartItemQuantity` - Update the quantity of a cart item (or remove if quantity is 0)
- `getCurrentCart` - Get all cart items with their `internalId` values
