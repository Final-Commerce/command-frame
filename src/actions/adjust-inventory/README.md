# adjustInventory

Adjusts the inventory/stock level for a specific product variant.

## Parameters

- `amount` (string, required): The amount to adjust (as a string to preserve precision)
- `stockType` ('add' | 'subtract' | 'set', required): The type of adjustment
  - `'add'`: Add stock (increases inventory)
  - `'subtract'`: Subtract stock (decreases inventory)
  - `'set'`: Set stock to a specific value (recount)
- `variantId` (string, optional): The ID of the product variant to adjust.

## Response

```typescript
{
  success: boolean;
  amount: string;
  stockType: 'add' | 'subtract' | 'set';
  newStock: number;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Add 10 units to inventory for a specific variant
await command.adjustInventory({
  amount: '10',
  stockType: 'add',
  variantId: 'variant-123'
});

// Subtract 5 units from inventory
await command.adjustInventory({
  amount: '5',
  stockType: 'subtract',
  variantId: 'variant-123'
});

// Set inventory to 50 units
await command.adjustInventory({
  amount: '50',
  stockType: 'set',
  variantId: 'variant-123'
});
```

## Error Handling

- Throws an error if parameters are missing
- Throws an error if `variantId` is not provided (and no active product context exists)
- Throws an error if subtracting would result in negative stock
- Throws an error if the API call fails
