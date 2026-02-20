# editProduct

Updates product metadata (name, description, status, etc.) for an existing product. Does not modify variants -- use `editProductVariants` for that.

## Parameters

### `EditProductParams`

```typescript
interface EditProductParams {
    productId: string;
    changes: {
        name?: string;
        description?: string;
        categories?: string[];
        taxTable?: string | null;
        images?: string[];
        status?: 'active' | 'inactive';
    };
}
```

#### `productId` (required)

The ID of the product to update.

#### `changes` (required)

Object containing the fields to update. Only provided fields are changed.

## Response

### `EditProductResponse`

```typescript
interface EditProductResponse {
    product: CFProduct;
    timestamp: string;
}
```

Returns the updated product with all current data.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.editProduct({
    productId: '64abc123def456',
    changes: {
        name: 'Updated Product Name',
        status: 'inactive',
    },
});
console.log(result.product.name); // "Updated Product Name"
```
