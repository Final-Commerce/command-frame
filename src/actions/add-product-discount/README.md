# addProductDiscount

Adds a discount to a specific product line item in the cart.

## Parameters

### `AddProductDiscountParams`

```typescript
interface AddProductDiscountParams {
    amount: number;        // Required
    internalId: string;    // Required: The internalId of the cart item to modify
    isPercent?: boolean;   // Optional, default: false
    label?: string;        // Optional, default: "Discount"
}
```

#### `internalId` (required)

The unique `internalId` of the line item in the cart. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

#### `amount` (required)

The discount amount. 
- If `isPercent` is `false`: Fixed amount (e.g., `10` = $10.00 off).
- If `isPercent` is `true`: Percentage amount (e.g., `10` = 10% off).

#### `isPercent` (optional)

Defaults to `false`.

#### `label` (optional)

Label for the discount (e.g., "Employee Discount").

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Add product and get its ID
const { internalId } = await command.addProductToCart({ variantId: 'v123' });

// 2. Add discount to that specific item
await command.addProductDiscount({
    internalId: internalId,
    amount: 20,
    isPercent: true,
    label: 'Flash Sale'
});
```
