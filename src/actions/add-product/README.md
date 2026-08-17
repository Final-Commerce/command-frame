# addProduct

Creates a new product in the parent application's product catalog.

**Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `AddProductParams`

```typescript
interface AddProductParams {
    name: string;
    description?: string;
    categories?: string[];
    taxTable?: string;
    images?: string[];
    status?: 'active' | 'inactive';
    price?: number;
    sku?: string;
    costPrice?: number;
    manageStock?: boolean;
    variants?: Omit<CFProductVariant, '_id'>[];
}
```

#### `name` (required)

The product name.

#### `price` (optional)

Price for a simple product (single variant), in integer minor units (cents). If `variants` array is provided, this is ignored.

#### `costPrice` (optional)

Cost price for a simple product, in integer minor units (cents).

#### `variants` (optional)

Array of variant objects for a variable product. Each variant includes SKU, price, attributes, etc. Omit `_id` as the backend assigns one.

## Response

### `AddProductResponse`

```typescript
interface AddProductResponse {
    product: CFProduct;
    timestamp: string;
}
```

Returns the full created product including variants and assigned IDs.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Simple product (price is in integer minor units, e.g. cents)
const result = await command.addProduct({
    name: 'My Product',
    price: 1999,
    sku: 'PROD-001',
    status: 'active',
});
console.log(result.product._id);

// Variable product with variants
const result2 = await command.addProduct({
    name: 'T-Shirt',
    variants: [
        { sku: 'SHIRT-S', price: 2500, salePrice: 0, isOnSale: false, manageStock: true, attributes: [{ name: 'Size', value: 'S' }] },
        { sku: 'SHIRT-M', price: 2500, salePrice: 0, isOnSale: false, manageStock: true, attributes: [{ name: 'Size', value: 'M' }] },
    ],
});
```
