# addProductToCart

Adds a product to the cart in the parent application. This atomic action handles product selection, application of options (discounts, fees, notes), and addition to the cart in a single step.

## Parameters

### `AddProductToCartParams`

```typescript
interface AddProductToCartParams {
    variantId: string;           // ID of variant to add.
    quantity?: number;           // Optional, default: 1
    discounts?: AddProductDiscountParams[]; // Optional array of discounts to apply immediately
    fees?: AddProductFeeParams[];           // Optional array of fees to apply immediately
    modifiers?: ModifierSelection[];        // Optional modifier selections, validated by the host before the line is added
    notes?: string | string[];              // Optional note or array of notes to add immediately
}
```

#### `modifiers` (optional)

The cashier's answers to the product's modifiers, one `ModifierSelection` per modifier
(`{ modifierId, choices: [{ choiceId, quantity }] }` — quantity is units per line-item
unit). The host validates against the product's resolved modifiers (required / min / max
counted in UNITS, per-outlet availability) BEFORE the line is added; a rejected add
returns `success: false` with a human-readable `reason`. Each selected choice becomes a
`modifiers[]` entry on the order line item, included in line and order totals and carried
through refunds. Money-wise a modifier sits at the product-fee level: never part of
grossSales, never reduced by a product discount — it joins the line after the discount,
alongside `fees`, and inherits the product's tax table by default. Selections apply to
every unit of the line — ring differing configurations as separate lines.

#### `variantId` (required)

The ID of the specific variant to add.

#### `quantity` (optional)

The quantity of the product to add to the cart. Defaults to 1.

#### `discounts` (optional)

An array of discount objects to apply to this specific cart item upon addition. See `addProductDiscount` for structure.

#### `fees` (optional)

An array of fee objects to apply to this specific cart item upon addition. See `addProductFee` for structure.

#### `notes` (optional)

A string or array of strings containing notes to attach to this cart item. If an array is passed, only the last entry is kept — each note overwrites the previous one, since the cart item stores a single note string rather than a list.

## Response

### `AddProductToCartResponse`

```typescript
interface AddProductToCartResponse {
    success: boolean;
    productId: string;
    variantId: string;
    internalId: string; // The unique ID of the line item in the cart
    name: string;
    quantity: number;
    timestamp: string;
}
```

#### `internalId` (string)

This is the unique identifier for the specific item instance added to the cart.

## Errors

- `"variantId is required"` — `variantId` was not provided.
- `` `Variant with ID ${variantId} not found` `` — no product/variant matches the given `variantId`.
- `"Product is out of stock"` — the variant is not unlimited-stock and has 0 or negative stock.
- `"Variant not found in product"`, `"Failed to build active product"`, `"Product creation failed"`, `"Product lost during processing"` — internal state-consistency guards; should not occur under normal use.

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
        amount: 150, // $1.50 in integer minor units
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
    // error.message === "Variant with ID invalid-id not found"
    console.error('Failed to add product:', error.message);
}
```

## Events

Always publishes a `product-added` event on the `cart` topic with the newly added product. If the cart was empty before this call, also publishes a `cart-created` event on the `cart` topic with the updated cart.
