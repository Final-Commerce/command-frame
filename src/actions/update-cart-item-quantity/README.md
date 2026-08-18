# updateCartItemQuantity

Updates the quantity of a cart item by its unique `internalId`. If the quantity is set to 0, the item will be removed from the cart. This action is useful for quantity selectors and cart management.

## Parameters

### `UpdateCartItemQuantityParams`

```typescript
interface UpdateCartItemQuantityParams {
    internalId: string;  // The unique identifier for the specific cart item to update
    quantity: number;   // The new quantity. If set to 0, the item will be removed
}
```

#### `internalId` (required)

The unique identifier for the specific cart item instance to update. This is the `internalId` returned when the product was originally added to the cart via `addProductToCart`.

#### `quantity` (required)

The new quantity for the cart item. If set to 0, the item will be removed from the cart (equivalent to calling `removeProductFromCart`). Must be a non-negative integer — a negative or non-integer value throws an error.

## Response

### `UpdateCartItemQuantityResponse`

```typescript
interface UpdateCartItemQuantityResponse {
    success: boolean;
    internalId: string;  // The unique identifier of the updated cart item
    quantity: number;   // The new quantity after the update
    timestamp: string;
}
```

## Usage Examples

### Update Quantity

Update a cart item's quantity:

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.updateCartItemQuantity({
    internalId: 'cart-item-internal-id-123',
    quantity: 3
});

console.log(`Updated quantity to ${result.quantity}`);
```

### Remove Item (Set Quantity to 0)

Remove an item by setting quantity to 0:

```typescript
const result = await command.updateCartItemQuantity({
    internalId: 'cart-item-internal-id-123',
    quantity: 0
});

console.log('Item removed from cart');
```

### Error Handling

```typescript
try {
    await command.updateCartItemQuantity({ 
        internalId: 'invalid-id',
        quantity: 2
    });
} catch (error) {
    console.error('Cart item not found:', error.message);
}
```

## Errors

- `"internalId is required"` — missing or falsy `internalId`
- `"quantity is required"` — `quantity` is `undefined` or `null`
- `"quantity must be a non-negative integer"` — `quantity` is negative, fractional, or not parseable as an integer
- `"Insufficient stock. Available: {stock}, Requested: {requested}"` — increasing quantity would push the combined quantity of that variant across all cart lines past available stock
- `"Cart item with internalId {internalId} not found"` — no matching product or custom sale line exists in the cart

## Events

- If quantity is updated (quantity > 0): Publishes a `product-updated` event on the `cart` topic
- If quantity is set to 0 (item removed): Publishes a `product-deleted` event on the `cart` topic

## Stock Validation

When increasing quantity on a product line, this action validates stock availability for variants that have stock management enabled (unlimited-stock variants skip the check). The check sums the requested quantity together with the quantity of that same variant on any other cart lines — if the combined total exceeds available stock, an `Insufficient stock. Available: X, Requested: Y` error is thrown.

## Notes

- `internalId` may also refer to a custom sale line in the cart, not just a product line. Custom sale lines are updated or removed the same way, but stock validation does not apply to them.
- For custom sale lines, the `product-updated` / `product-deleted` events are still published on the `cart` topic, but the event's `product` field carries the custom sale object rather than an `ActiveProduct` (there is currently no dedicated custom-sale cart event).

## Related Actions

- `addProductToCart` - Add a product to the cart (returns `internalId`)
- `removeProductFromCart` - Remove a product from the cart
- `getCurrentCart` - Get all cart items with their `internalId` values
