# removeProductFromCart

Removes a product from the cart by its unique `internalId`. This action is useful for removing specific cart items when you know the exact cart item identifier.

`internalId` is also matched against custom sale line items already in the cart as a fallback (products are checked first) — so this action can remove either a regular product line item or a custom sale line item. To remove a custom sale explicitly, use [`removeCustomSale`](../remove-custom-sale/README.md).

## Parameters

### `RemoveProductFromCartParams`

```typescript
interface RemoveProductFromCartParams {
    internalId: string;  // The unique identifier for the specific cart item to remove
}
```

#### `internalId` (required)

The unique identifier for the specific cart item instance to remove. This is the `internalId` returned when the product was originally added to the cart via `addProductToCart`. If no matching product is found, the handler also checks the cart's custom sale line items for a matching id (the `customSaleId` returned by `addCustomSale`) and removes that instead.

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

## Error Handling

The handler throws in the following cases:

- Missing `internalId`: throws `"internalId is required"`
- `internalId` does not match any product or custom sale line item in the cart: throws `` `Cart item with internalId ${internalId} not found` ``

## Events

This action publishes a `product-deleted` event on the `cart` topic when a cart item is successfully removed. When the removed item is a custom sale (matched via the fallback described above), the event's `product` field is populated with the custom sale object rather than a product — there is currently no dedicated custom-sale-removed event for this path.

## Related Actions

- `addProductToCart` - Add a product to the cart (returns `internalId`)
- `updateCartItemQuantity` - Update the quantity of a cart item (or remove if quantity is 0)
- `getCurrentCart` - Get all cart items with their `internalId` values
- `removeCustomSale` - Dedicated action for removing a custom sale line item by its `customSaleId`
