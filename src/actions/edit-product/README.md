# editProduct

Updates product metadata (name, description, status, etc.) for an existing product. Does not modify variants -- use `editProductVariants` for that.

**Low-level: edits only the product document.** Use `createProductWithVariants` for the full deerlake-style nested create.

> **Manage-only.** This is an administrative command scoped to the Manage app (product catalog admin). It has no kaching POS-runtime handler.

## Parameters

### `EditProductParams`

```typescript
interface EditProductParams {
  productId: string;
  changes: {
    name?: string;
    description?: string;
    shortDescription?: string;
    categories?: string[];
    taxTable?: string | null;
    images?: string[];
    status?: 'active' | 'inactive' | 'draft';
    sku?: string;
    barcode?: string;
    tags?: string[];
  };
}
```

| Param                      | Type                                | Required | Notes                               |
| -------------------------- | ----------------------------------- | -------- | ----------------------------------- |
| `productId`                | `string`                            | yes      | The ID of the product to update.    |
| `changes`                  | `object`                            | yes      | Only provided fields are changed.   |
| `changes.name`             | `string`                            | no       |                                     |
| `changes.description`      | `string`                            | no       |                                     |
| `changes.shortDescription` | `string`                            | no       |                                     |
| `changes.categories`       | `string[]`                          | no       | Category ids (ObjectId strings).    |
| `changes.taxTable`         | `string \| null`                    | no       | Pass `null` to clear the tax table. |
| `changes.images`           | `string[]`                          | no       |                                     |
| `changes.status`           | `'active' \| 'inactive' \| 'draft'` | no       |                                     |
| `changes.sku`              | `string`                            | no       |                                     |
| `changes.barcode`          | `string`                            | no       |                                     |
| `changes.tags`             | `string[]`                          | no       |                                     |

## Response

### `EditProductResponse`

```typescript
interface EditProductResponse {
  success: boolean;
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
