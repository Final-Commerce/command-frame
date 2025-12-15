# addProductFee

Adds a fee to a specific product line item in the cart.

## Parameters

### `AddProductFeeParams`

```typescript
interface AddProductFeeParams {
    amount: number;        // Required
    cartItemId: string;    // Required: The internalId of the cart item to modify
    isPercent?: boolean;   // Optional, default: false
    label?: string;        // Optional, default: "Fee"
    applyTaxes?: boolean;  // Optional, default: false
}
```

#### `cartItemId` (required)

The unique `internalId` of the item in the cart you wish to modify. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

#### `amount` (required)

The fee amount.

#### `isPercent` (optional)

Whether the fee is a percentage of the item price.

#### `label` (optional)

Label for the fee.

#### `applyTaxes` (optional)

Whether taxes should be calculated on this fee.

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Add fee to that specific item
await command.addProductFee({
    cartItemId: internalId,
    amount: 2.00,
    label: 'Recycling Fee'
});
```
