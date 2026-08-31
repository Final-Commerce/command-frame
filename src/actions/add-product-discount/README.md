# addProductDiscount

Adds a discount to a product in the cart. Applies to a specific line item when `internalId` is given, or to the current active product context otherwise.

## Parameters

### `AddProductDiscountParams`

```typescript
interface AddProductDiscountParams {
  amount: number; // Required
  internalId?: string; // Optional: The internalId of the cart item to modify
  isPercent?: boolean; // Optional, default: false
  label?: string; // Optional, default: "Discount"
}
```

#### `internalId` (optional)

The unique `internalId` of the line item in the cart. This ID is returned in the response of `addProductToCart` or `getCurrentCart`.

If omitted, the discount is applied to the current active product context instead of a specific cart line item — this requires an active product to already be set (e.g. via `addProductToCart`); otherwise the call throws.

#### `amount` (required)

The discount amount.

- If `isPercent` is `false`: Fixed amount in integer minor currency units (e.g., `1000` = $10.00 off). Must be a positive integer.
- If `isPercent` is `true`: Percentage amount, must be greater than 0 and at most 100 (e.g., `10` = 10% off).

#### `isPercent` (optional)

Defaults to `false`.

#### `label` (optional)

Label for the discount (e.g., "Employee Discount"). Defaults to `"Discount"`.

## Response

### `AddProductDiscountResponse`

```typescript
interface AddProductDiscountResponse {
  success: boolean;
  amount: number;
  isPercent: boolean;
  label: string;
  internalId?: string; // Present only when internalId was passed in
  timestamp: string;
}
```

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
  label: 'Flash Sale',
});
```

## Errors

- `"Parameters are required for addProductDiscount"` — thrown if called with no `params` at all.
- `"Discount amount is required"` — thrown if `amount` is `undefined` or `null`.
- `"Discount amount must be a valid number"` — `amount` is not a finite number.
- `"Discount percentage must be between 0 and 100"` — `isPercent: true` and `amount` is `<= 0` or `> 100`.
- `"Discount amount must be greater than 0"` — `isPercent` is `false`/omitted and `amount` is `<= 0`.
- `"Discount amount must be an integer amount in minor currency units (e.g. 1575 = $15.75)"` — `isPercent` is `false`/omitted and `amount` is not an integer.
- `No cart item with internalId "<id>". Pass the internalId returned by addProductToCart (a productId or variantId will not match — internalId is the per-cart-line identifier).` — `internalId` was passed but no matching line item exists in the cart.
- `"No product context. Provide internalId (to update an existing cart item) or use addProductToCart(...) with discounts."` — `internalId` was omitted and there is no active product context.

## Events

Publishes a `product-discount-added` event on the `cart` topic, with the updated product, the applied `discount` (`{ amount, isPercent, label }`), and `internalId` when one was passed in.
