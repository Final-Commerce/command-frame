# addProductToCart

Adds a product to the cart in the parent application. This atomic action handles product selection, application of options (discounts, fees, notes), and addition to the cart in a single step. `quantity` may be fractional when the variant carries a `unit` (1.509 kg is a sale) — build quantity inputs from `unit.precision`, never as a hardcoded integer stepper.

## Parameters

### `AddProductToCartParams`

```typescript
interface AddProductToCartParams {
  variantId: string; // ID of variant to add.
  quantity?: number; // Optional, default: 1
  discounts?: AddProductDiscountParams[]; // Optional array of discounts to apply immediately
  fees?: AddProductFeeParams[]; // Optional array of fees to apply immediately
  notes?: string | string[]; // Optional note or array of notes to add immediately
}
```

#### `variantId` (required)

The ID of the specific variant to add.

#### `quantity` (optional)

The quantity of the product to add to the cart. Defaults to 1.

#### `discounts` (optional)

An array of discount objects to apply to this specific cart item upon addition. See `addProductDiscount` for structure.

#### `fees` (optional)

An array of fee objects to apply to this specific cart item upon addition. See `addProductFee` for structure.

#### `notes` (optional)

A string or array of strings containing notes to attach to this cart item.

### Quantities and units

A variant may be sold by measure — per kilogram, per litre, per metre — rather than by the piece.
Such a variant carries a resolved `unit` alongside its `unitId`:

```typescript
variant.unit = {
    _id: string;
    name: string;          // "Litre"
    abbreviation: string;  // "l"
    ratioToBase: number;   // 1000 — millilitres in a litre
    precision: number;     // 3 — decimals a quantity may carry
}
```

`price` is per that unit, and `quantity` is denominated in it. `0.456` is a real quantity.

**Build the quantity field from `unit.precision`**, never from a constant:

```typescript
const precision = variant.unit?.precision ?? 0; // no unit → sold by the piece
const step = 1 / 10 ** precision; // 0.001 for a litre, 1 for a piece
```

The engine refuses a quantity finer than the unit allows and names the unit in the error — surface
that message; the cashier needs to know whether to drop a decimal or whether the item simply is not
sold that way. Do not round, floor or clamp the typed value first: a quantity that is silently
altered is charged and deducted differently from the one the cashier entered, and neither of them
is the one on the scale.

The line total is `price × quantity`, rounded to the currency's minor unit exactly once. Compute it
with `extendPrice` from `@final-commerce/common` rather than multiplying — a float multiply drifts,
and coercing the quantity to an integer first is how `4.234 L` was once charged as four.

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

## Usage Examples

### Simple Add

Add a product with default quantity:

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addProductToCart({
  variantId: 'variant-id-123',
});

console.log(`Added item with internal ID: ${result.internalId}`);
```

### Advanced Add (Atomic)

Add a product with quantity, discount, fee, and note all in one request:

```typescript
const result = await command.addProductToCart({
  variantId: 'variant-id-123',
  quantity: 2,
  discounts: [
    {
      amount: 5,
      isPercent: true,
      label: 'Happy Hour 5%',
    },
  ],
  fees: [
    {
      amount: 1.5,
      label: 'Service Charge',
    },
  ],
  notes: 'No onions',
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
