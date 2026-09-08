# addCartFee

Adds a fee to the entire cart. Supports both fixed amount and percentage-based fees.

## Parameters

- `amount` (number, required): The fee amount. Fixed fees are integer minor currency units (e.g., `500` = $5.00); percentage fees are 0-100
- `isPercent` (boolean, optional): Whether the amount is a percentage (default: false)
- `label` (string, optional): Label for the fee (default: 'Fee')
- `applyTaxes` (boolean, optional): Whether to apply taxes to the fee (default: false)
- `taxTableId` (string, optional): Tax table ID to use if taxes are applied

## Response

```typescript
{
  success: boolean;
  amount: number;
  isPercent: boolean;
  label: string;
  applyTaxes: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Add a fixed fee
await command.addCartFee({
  amount: 500, // $5.00 in minor units
  label: 'Service Fee',
  applyTaxes: true,
});

// Add a percentage-based fee
await command.addCartFee({
  amount: 10,
  isPercent: true,
  label: 'Processing Fee',
});
```

## Error Handling

- Throws `Parameters are required for addCartFee` if no params object is passed
- Throws `Fee amount is required` if `amount` is `undefined` or `null`
- Throws `Cart fee amount must be greater than 0` if `amount` is `0` or negative
- Throws `Fee amount must be an integer in minor currency units (e.g. 1575 = $15.75)` if `isPercent` is `false` and `amount` is not an integer (e.g. `15.75`)

## Events

This action publishes a `cart-fee-added` event on the `cart` topic when a fee is successfully added.
