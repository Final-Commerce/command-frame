# addCartFee

Adds a fee to the entire cart. Supports both fixed amount and percentage-based fees.

## Parameters

- `amount` (number, required): The fee amount (as a fixed value or percentage)
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
  amount: 5.00,
  label: 'Service Fee',
  applyTaxes: true
});

// Add a percentage-based fee
await command.addCartFee({
  amount: 10,
  isPercent: true,
  label: 'Processing Fee'
});
```

## Error Handling

- Throws an error if parameters are missing

