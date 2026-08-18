# addProduct

Creates a new product in the parent application's product catalog.

**Low-level: creates only the product document.** Use `createProductWithVariants` for the full deerlake-style nested create (product + variants + inventory in one call).

**Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `AddProductParams`

```typescript
interface AddProductParams {
  name: string;
  description?: string;
  shortDescription?: string;
  categories?: string[];
  taxTable?: string;
  images?: string[];
  status?: 'active' | 'inactive' | 'draft';
  sku?: string;
  barcode?: string;
  tags?: string[];
  productType?: 'simple' | 'variable';
  _id?: string;
}
```

| Param              | Type                                | Required | Notes                                                                                                                                                        |
| ------------------ | ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`             | `string`                            | yes      | The product name.                                                                                                                                            |
| `description`      | `string`                            | no       | Full description.                                                                                                                                            |
| `shortDescription` | `string`                            | no       | Short/teaser description.                                                                                                                                    |
| `categories`       | `string[]`                          | no       | Category ids (ObjectId strings). Defaults to `[]`.                                                                                                           |
| `taxTable`         | `string`                            | no       | Tax table id. Only set on the product when provided (spec §6.1).                                                                                             |
| `images`           | `string[]`                          | no       | Image URLs, uploaded separately (see `uploadImage`). Defaults to `[]`.                                                                                       |
| `status`           | `'active' \| 'inactive' \| 'draft'` | no       | Defaults to `'active'`.                                                                                                                                      |
| `sku`              | `string`                            | no       | Product-level SKU.                                                                                                                                           |
| `barcode`          | `string`                            | no       | Product-level barcode.                                                                                                                                       |
| `tags`             | `string[]`                          | no       | Free-form tags.                                                                                                                                              |
| `productType`      | `'simple' \| 'variable'`            | no       | `'variable'` when the caller will attach variants afterward (via `editProductVariants`); defaults to `'simple'`.                                             |
| `_id`              | `string`                            | no       | Honor a caller-generated ObjectId — orchestrators (like `createProductWithVariants`) pre-generate ids so they can reference the product before it's created. |

## Response

### `AddProductResponse`

```typescript
interface AddProductResponse {
  success: boolean;
  product: CFProduct;
  timestamp: string;
}
```

Returns the created product document (no variants — see above).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addProduct({
  name: 'My Product',
  sku: 'PROD-001',
  status: 'active',
});
console.log(result.product._id);

// Variable product — variants are attached in a follow-up editProductVariants call
const result2 = await command.addProduct({
  name: 'T-Shirt',
  productType: 'variable',
});
```
