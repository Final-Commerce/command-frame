# removeProductDiscount

Removes the discount(s) from a product in the cart. Applies to a specific line item when `internalId` is given, or to the current active product context otherwise.

## Parameters

### `RemoveProductDiscountParams`

```typescript
interface RemoveProductDiscountParams {
    internalId?: string;   // Optional: The internalId of the cart item to modify
}
```

#### `internalId` (optional)

The unique `internalId` of the line item in the cart. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

If provided, the discounts are cleared from that cart line item and the updated item is re-applied to the cart. If omitted, the discounts are cleared from the current active product context instead — this requires an active product to already be set (e.g. via `addProductToCart`); otherwise the call throws.

## Response

### `RemoveProductDiscountResponse`

```typescript
interface RemoveProductDiscountResponse {
    success: boolean;
    internalId?: string;  // Present only when internalId was passed in
    timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Remove discount from that specific item
await command.removeProductDiscount({ internalId });

// Or remove discount from the current active product context
await command.removeProductDiscount();
```

## Errors

- `Product with ID <id> not found in cart` — thrown when `internalId` is passed but no matching line item exists in the cart.
- `"No active product. Provide internalId or use setActiveProduct first."` — thrown when `internalId` is omitted and there is no active product context.

## Events

Publishes a `product-discount-removed` event on the `cart` topic. When `internalId` is passed, the payload includes the updated `product` and `internalId`; when omitted, the payload includes only the active `product`.
