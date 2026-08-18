# addProductFee

Adds a fee to a specific product line item in the cart, or to the current active product if no `internalId` is given.

## Parameters

### `AddProductFeeParams`

```typescript
interface AddProductFeeParams {
    amount: number;         // Required
    internalId?: string;    // Optional: The internalId of the cart item to modify
    isPercent?: boolean;    // Optional, default: false
    label?: string;         // Optional, default: "Fee"
    applyTaxes?: boolean;   // Optional, default: false
}
```

#### `internalId` (optional)

The unique `internalId` of the line item in the cart to add the fee to. This ID is returned in the response of `addProductToCart` or `getCurrentCart`. If omitted, the fee is added to the current active product context instead; if there is no `internalId` and no active product, the call throws.

#### `amount` (required)

The fee amount. Fixed amount in integer minor currency units (e.g., `200` = $2.00; must be a positive whole number); if `isPercent` is `true`, a value greater than 0 and up to 100.

#### `isPercent` (optional)

Whether the fee is a percentage of the item price.

#### `label` (optional)

Label for the fee.

#### `applyTaxes` (optional)

Whether taxes should be calculated on this fee. When `true`, the fee is taxed using the **tax table of the product line it is attached to** — a product fee has no tax table of its own, so there is no `taxTableId` parameter here. (This differs from [`addCartFee`](../add-cart-fee/README.md), a cart-level fee not tied to a line, which does take an explicit `taxTableId`.)

## Response

### `AddProductFeeResponse`

```typescript
interface AddProductFeeResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    internalId?: string;  // Only present when internalId was passed in the request
    timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Add fee to that specific item
await command.addProductFee({
    internalId: internalId,
    amount: 200, // $2.00 in minor units
    label: 'Recycling Fee'
});
```

## Error Handling

- Throws if no parameters are passed.
- Throws if `amount` is missing.
- Throws if `amount` is not a valid number, is `0` or negative, or (when `isPercent` is `true`) is greater than `100`.
- Throws if `amount` is a fixed (non-percent) value that isn't a whole number, since fixed amounts must be an integer count of minor units.
- Throws if `internalId` is provided but doesn't match any item currently in the cart.
- Throws if `internalId` is omitted and there is no active product context to fall back to.

## Events

Publishes a `product-fee-added` event on the `cart` topic with the updated product and the fee that was applied.
