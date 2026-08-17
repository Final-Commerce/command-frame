# setActiveProductDiscount

Sets the discount on the currently active product context (does not touch the cart directly). Replaces any discount already on the active product — it does not stack with a previous call.

## Parameters

### `SetActiveProductDiscountParams`

```typescript
interface SetActiveProductDiscountParams {
    amount: number;        // Required
    isPercent?: boolean;   // Optional, default: false
    label?: string;        // Optional, default: "Discount"
}
```

#### `amount` (required)

The discount amount.
- If `isPercent` is `false`: Fixed amount in integer minor currency units (e.g., `1000` = $10.00 off). Must be a positive integer.
- If `isPercent` is `true`: Percentage amount, must be greater than 0 and at most 100 (e.g., `10` = 10% off).

#### `isPercent` (optional)

Defaults to `false`.

#### `label` (optional)

Label for the discount (e.g., "Employee Discount"). Defaults to `"Discount"`.

## Response

### `SetActiveProductDiscountResponse`

```typescript
interface SetActiveProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Set the active product
await command.setActiveProduct({ variantId: 'v123' });

// 2. Apply a discount to it
await command.setActiveProductDiscount({
    amount: 20,
    isPercent: true,
    label: 'Flash Sale'
});
```

## Errors

- `"Discount amount is required"` — thrown if `amount` is `undefined` or `null`.
- `"No active product. Call setActiveProduct first."` — thrown if there is no active product context.
- `"Discount amount must be a valid number"` — `amount` is not a finite number.
- `"Discount percentage must be between 0 and 100"` — `isPercent: true` and `amount` is `<= 0` or `> 100`.
- `"Discount amount must be greater than 0"` — `isPercent` is `false`/omitted and `amount` is `<= 0`.
- `"Discount amount must be an integer amount in minor currency units (e.g. 1575 = $15.75)"` — `isPercent` is `false`/omitted and `amount` is not an integer.
