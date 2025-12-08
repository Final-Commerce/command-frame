# adjustInventory

Adjusts the inventory/stock level for the currently active product.

## Parameters

- `amount` (string, required): The amount to adjust (as a string to preserve precision)
- `stockType` ('add' | 'subtract' | 'set', required): The type of adjustment
  - `'add'`: Add stock (increases inventory)
  - `'subtract'`: Subtract stock (decreases inventory)
  - `'set'`: Set stock to a specific value (recount)

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
import { commands } from '@final-commerce/command-frame';

// Add 10 units to inventory
await commands.adjustInventory({
  amount: '10',
  stockType: 'add'
});

// Subtract 5 units from inventory
await commands.adjustInventory({
  amount: '5',
  stockType: 'subtract'
});

// Set inventory to 50 units
await commands.adjustInventory({
  amount: '50',
  stockType: 'set'
});
```

## Requirements

- A product must be set as active using `setProductActive` before adjusting inventory
- The product must have inventory tracking enabled

## Error Handling

- Throws an error if parameters are missing
- Throws an error if no product is currently active
- Throws an error if subtracting would result in negative stock
- Throws an error if the API call fails

