# deleteProduct

Deletes a product from the catalog.

**Low-level: deletes only the product document (and cascades to its variants).** Use `createProductWithVariants` for the full deerlake-style nested create.

Soft delete; cascades to the product's variants ONLY — it does not touch other products' variants or inventory rows outside this product (spec §6.6).

> **Manage-scoped command.** This is a Manage administrative command (product catalog management), not a kaching POS-runtime command — there is no kaching command-frame handler for it.

## Parameters

### `DeleteProductParams`

```typescript
interface DeleteProductParams {
  productId: string;
}
```

| Param       | Type     | Required | Notes                            |
| ----------- | -------- | -------- | -------------------------------- |
| `productId` | `string` | yes      | The ID of the product to delete. |

## Response

### `DeleteProductResponse`

```typescript
interface DeleteProductResponse {
  success: boolean;
  productId: string;
  deletedVariantIds: string[];
  timestamp: string;
}
```

`deletedVariantIds` lists the ids of the product's variants that were cascade soft-deleted along with it.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.deleteProduct({
  productId: '64abc123def456',
});
console.log(result.success, result.deletedVariantIds);
```
