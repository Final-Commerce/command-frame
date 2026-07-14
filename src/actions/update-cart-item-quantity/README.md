# updateCartItemQuantity

Updates the quantity of a cart item by its unique `internalId`. Works for both product lines and custom sale lines. If the quantity is set to 0, the item will be removed from the cart. This action is useful for quantity selectors and cart management.

## Parameters

### `UpdateCartItemQuantityParams`

```typescript
interface UpdateCartItemQuantityParams {
    internalId: string; // The unique identifier for the specific cart item to update
    quantity: number; // The new quantity. If set to 0, the item will be removed
}
```

#### `internalId` (required)

The unique identifier for the specific cart item instance to update:

- For products: the `internalId` returned when the product was added via `addProductToCart`
- For custom sales: the `customSaleId` returned when the line was added via `addCustomSale`

#### `quantity` (required)

The new quantity for the cart item. If set to 0, the item will be removed from the cart (equivalent to calling `removeProductFromCart`).

## Response

### `UpdateCartItemQuantityResponse`

```typescript
interface UpdateCartItemQuantityResponse {
    success: boolean;
    internalId: string; // The unique identifier of the updated cart item
    quantity: number; // The new quantity after the update
    timestamp: string;
}
```

## Usage Examples

### Update Quantity

Update a cart item's quantity:

```typescript
import { command } from "@final-commerce/command-frame";

const result = await command.updateCartItemQuantity({
    internalId: "cart-item-internal-id-123",
    quantity: 3
});

console.log(`Updated quantity to ${result.quantity}`);
```

### Update a Custom Sale's Quantity

Custom sale lines use the same action — pass the `customSaleId` as the `internalId`:

```typescript
const sale = await command.addCustomSale({ label: "Raffle Ticket", price: 2.0 });

const result = await command.updateCartItemQuantity({
    internalId: sale.customSaleId,
    quantity: 5
});
```

### Remove Item (Set Quantity to 0)

Remove an item by setting quantity to 0:

```typescript
const result = await command.updateCartItemQuantity({
    internalId: "cart-item-internal-id-123",
    quantity: 0
});

console.log("Item removed from cart");
```

### Error Handling

```typescript
try {
    await command.updateCartItemQuantity({
        internalId: "invalid-id",
        quantity: 2
    });
} catch (error) {
    console.error("Cart item not found:", error.message);
}
```

## Events

- If quantity is updated (quantity > 0): Publishes a `product-updated` event on the `cart` topic
- If quantity is set to 0 (item removed): Publishes a `product-deleted` event on the `cart` topic

## Stock Validation

When increasing a product's quantity, this action validates stock availability. If insufficient stock is available, an error will be thrown. Custom sales have no stock, so no stock validation applies to them.

## Related Actions

- `addProductToCart` - Add a product to the cart (returns `internalId`)
- `removeProductFromCart` - Remove a product from the cart
- `addCustomSale` - Add a custom sale line (returns `customSaleId`, usable here as `internalId`)
- `removeCustomSale` - Remove a custom sale line
- `getCurrentCart` - Get all cart items with their `internalId` values
