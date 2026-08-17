# editProductVariants

Performs batch variant operations on a product: add new variants, update existing ones, or delete variants.

> **Manage-scoped command.** This is a Manage administrative command (product catalog management), not a kaching POS-runtime command — there is no kaching command-frame handler for it.

## Parameters

### `EditProductVariantsParams`

```typescript
interface EditProductVariantsParams {
    productId: string;
    additions?: Omit<CFProductVariant, '_id'>[];
    changes?: Array<{ _id: string; changes: Partial<CFProductVariant> }>;
    deletions?: string[];
}
```

#### `productId` (required)

The ID of the product whose variants to modify.

#### `additions` (optional)

Array of new variants to add. Omit `_id` as the backend assigns one.

#### `changes` (optional)

Array of variant updates. Each entry has `_id` (the variant to update) and `changes` (partial variant fields to update).

#### `deletions` (optional)

Array of variant IDs to delete.

## Response

### `EditProductVariantsResponse`

```typescript
interface EditProductVariantsResponse {
    success: boolean;
    timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.editProductVariants({
    productId: '64abc123def456',
    additions: [
        // price/salePrice are in integer minor units (cents)
        { sku: 'NEW-VAR', price: 1500, salePrice: 0, isOnSale: false, manageStock: true, attributes: [{ name: 'Size', value: 'XL' }] },
    ],
    changes: [
        { _id: 'variant_001', changes: { price: 1200 } },
    ],
    deletions: ['variant_old_001'],
});
console.log(result.success); // true
```
