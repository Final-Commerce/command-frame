# setActiveProductFee

Sets the fee on the currently active product. This replaces any fee already set on the active product — the active product holds at most one fee via this action, so calling it again overwrites the previous fee rather than adding a second one.

## Parameters

### `SetActiveProductFeeParams`

```typescript
interface SetActiveProductFeeParams {
  amount: number; // Required
  isPercent?: boolean; // Optional, default: false
  label?: string; // Optional, default: "Fee"
  applyTaxes?: boolean; // Optional, default: false
  taxTableId?: string; // Optional: not currently applied (see below)
}
```

#### `amount` (required)

The fee amount. Fixed amount in integer minor currency units (e.g., `500` = $5.00; must be a positive whole number); if `isPercent` is `true`, a value greater than 0 and up to 100 (fractional percentages such as `12.5` are allowed).

#### `isPercent` (optional)

Whether the fee is a percentage of the product price.

#### `label` (optional)

Label for the fee.

#### `applyTaxes` (optional)

Whether taxes should be calculated on this fee.

#### `taxTableId` (optional)

Part of the contract, but not currently applied: the handler always uses the active product's own tax table and ignores any `taxTableId` passed here.

## Response

### `SetActiveProductFeeResponse`

```typescript
interface SetActiveProductFeeResponse {
  success: boolean;
  amount: number;
  isPercent: boolean;
  label: string;
  applyTaxes: boolean;
  timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Set the active product
await command.setActiveProduct({ variantId: 'v123' });

// 2. Set a fee on it
await command.setActiveProductFee({
  amount: 500, // $5.00 in minor units
  label: 'Recycling Fee',
});
```

## Error Handling

- Throws if `amount` is missing (`undefined` or `null`).
- Throws if there is no active product (call `setActiveProduct` first).
- Throws if `amount` is not a valid number, is `0` or negative, or (when `isPercent` is `true`) is greater than `100`.
- Throws if `amount` is a fixed (non-percent) value that isn't a whole number, since fixed amounts must be an integer count of minor units.
