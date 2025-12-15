# addProductToCart

Adds a product to the cart in the parent application. This atomic action handles product selection, application of options (discounts, fees, notes), and addition to the cart in a single step.

## Parameters

### `AddProductToCartParams`

```typescript
interface AddProductToCartParams {
    variantId: string;           // Optional but recommended, ID of variant to add.
    quantity?: number;           // Optional, default: 1
    discounts?: AddProductDiscountParams[]; // Optional array of discounts to apply immediately
    fees?: AddProductFeeParams[];           // Optional array of fees to apply immediately
    notes?: string | string[];              // Optional note or array of notes to add immediately
}
```

#### `variantId` (optional but recommended)

The ID of the specific variant to add.

#### `quantity` (optional)

The quantity of the product to add to the cart. Defaults to 1.

#### `discounts` (optional)

An array of discount objects to apply to this specific cart item upon addition. See `addProductDiscount` for structure.

#### `fees` (optional)

An array of fee objects to apply to this specific cart item upon addition. See `addProductFee` for structure.

#### `notes` (optional)

A string or array of strings containing notes to attach to this cart item.

## Response

### `AddProductToCartResponse`

```typescript
interface AddProductToCartResponse {
    success: boolean;
    productId: string;
    variantId: string;
    internalId: string; // The unique ID of the line item in the cart (use this for future updates like adding fees/notes)
    name: string;
    quantity: number;
    timestamp: string;
}
```

#### `internalId` (string)

This is the unique identifier for the specific item instance added to the cart. **Important:** You should store this ID if you plan to modify this specific line item later (e.g., to add more notes or fees specifically to this item) using commands like `addProductNote({ cartItemId: internalId, ... })`.

## Usage Examples

### Simple Add

Add a product with default quantity:

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addProductToCart({
    variantId: 'variant-id-123'
});

console.log(`Added item with internal ID: ${result.internalId}`);
```

### Advanced Add (Atomic)

Add a product with quantity, discount, fee, and note all in one request:

```typescript
const result = await command.addProductToCart({
    variantId: 'variant-id-123',
    quantity: 2,
    discounts: [{
        amount: 5,
        isPercent: true,
        label: 'Happy Hour 5%'
    }],
    fees: [{
        amount: 1.50,
        label: 'Service Charge'
    }],
    notes: 'No onions'
});
```

### Error Handling

```typescript
try {
    await command.addProductToCart({ variantId: 'invalid-id' });
} catch (error) {
    console.error('Product not found:', error.message);
}
```
