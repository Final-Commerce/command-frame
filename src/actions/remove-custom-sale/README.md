# removeCustomSale

Removes a custom sale line item from the cart by its `id`. To add a custom sale item, use [`addCustomSale`](../add-custom-sale/README.md); to edit one in place, use [`editCustomSale`](../edit-custom-sale/README.md).

## Parameters

### `RemoveCustomSaleParams`

```typescript
interface RemoveCustomSaleParams {
    id: string;  // The id of the custom sale to remove
}
```

#### `id` (required)

The id of the custom sale line item to remove from the cart (the `customSaleId` returned by `addCustomSale`).

## Response

### `RemoveCustomSaleResponse`

```typescript
interface RemoveCustomSaleResponse {
    success: boolean;
    id: string;  // Echoes the removed custom sale id
    timestamp: string;
}
```

## Usage Examples

### Remove Custom Sale

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.removeCustomSale({
    id: 'custom-sale-id-123'
});

console.log(`Removed custom sale: ${result.id}`);
```

### Error Handling

```typescript
try {
    await command.removeCustomSale({ id: 'invalid-id' });
} catch (error) {
    console.error('Custom sale not found:', error.message);
}
```

## Error Handling

The handler throws in the following cases:

- Missing `id`: throws `"Custom sale id is required"`
- No custom sales currently in the cart: throws `"No custom sales to remove from cart"`
- `id` does not match any custom sale in the cart: throws `` `Custom sale with id ${id} not found in cart` ``

## Events

This action publishes a `product-deleted` event on the `cart` topic when a custom sale is successfully removed — there is currently no dedicated custom-sale-removed cart event; the removed custom sale is passed through as the event's `product` field.

## Related Actions

- `addCustomSale` - Add a custom sale item to the cart (returns the generated `customSaleId`)
- `editCustomSale` - Edit an existing custom sale line item
