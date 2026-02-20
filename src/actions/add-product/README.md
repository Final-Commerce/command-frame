# addProduct

Creates a new product in the parent application's product catalog.

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
    price?: string;
    sku?: string;
    costPrice?: string;
    manageStock?: boolean;
    variants?: Omit<CFProductVariant, '_id'>[];
}
```

#### `name` (required)

The product name.

#### `price` (optional)

Price for a simple product (single variant). If `variants` array is provided, this is ignored.

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

// Simple product
const result = await command.addProduct({
    name: 'My Product',
    price: '19.99',
    sku: 'PROD-001',
    status: 'active',
});
console.log(result.product._id);

// Variable product with variants
const result2 = await command.addProduct({
    name: 'T-Shirt',
    variants: [
        { sku: 'SHIRT-S', price: '25.00', salePrice: '0', isOnSale: false, manageStock: true, attributes: [{ name: 'Size', value: 'S' }] },
        { sku: 'SHIRT-M', price: '25.00', salePrice: '0', isOnSale: false, manageStock: true, attributes: [{ name: 'Size', value: 'M' }] },
    ],
});
```
