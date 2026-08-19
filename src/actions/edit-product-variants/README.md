# editProductVariants

Performs batch variant operations on a product: add new variants, update existing ones, or delete variants.

**Low-level: edits only variant documents on an existing product.** Use `createProductWithVariants` for the full deerlake-style nested create (product + variants + inventory in one call).

Mirrors hub-api's `POST product/variants` semantics: additions are full variant docs (client `_id` honored) that dense-seed inventory rows and flip the product's `productType` to `'variable'`; deletions soft-delete the variants AND their inventory rows (spec §6.6).

> **Manage-scoped command.** This is a Manage administrative command (product catalog management), not a kaching POS-runtime command — there is no kaching command-frame handler for it.

## Parameters

### `EditProductVariantsParams`

```typescript
interface EditProductVariantsParams {
  productId: string;
  additions?: (Omit<CFProductVariant, '_id'> & { _id?: string })[];
  changes?: Array<{ _id: string; changes: Partial<CFProductVariant> }>;
  deletions?: string[];
}
```

| Param       | Type                                                         | Required | Notes                                                                                                                                                    |
| ----------- | ------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId` | `string`                                                     | yes      | The ID of the product whose variants to modify.                                                                                                          |
| `additions` | `(Omit<CFProductVariant, '_id'> & { _id?: string })[]`       | no       | New variants to add. `_id` is optional — if omitted the backend assigns one; if provided (e.g. by an orchestrator that pre-generated ids), it's honored. |
| `changes`   | `Array<{ _id: string; changes: Partial<CFProductVariant> }>` | no       | Each entry has `_id` (the variant to update) and `changes` (partial variant fields to update).                                                           |
| `deletions` | `string[]`                                                   | no       | Variant ids to soft-delete, along with their inventory rows.                                                                                             |

### Validation (host-enforced)

The product must exist; `changes[]._id` and `deletions` ids must belong to
**this product's** live variants (cross-product write protection); `additions`
are fully validated (integer minor-unit money, attribute name+value pairs,
inventory seeds with `outletId` + integer `stock`, no duplicate attribute
combinations in one payload). Rejections happen before any write.

## Response

### `EditProductVariantsResponse`

```typescript
interface EditProductVariantsResponse {
  success: boolean;
  added: string[];
  changed: string[];
  deleted: string[];
  timestamp: string;
}
```

`added`/`changed`/`deleted` echo the ids actually written per bucket, so orchestrators can verify the outcome.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.editProductVariants({
  productId: '64abc123def456',
  additions: [
    // price/salePrice are in integer minor units (cents)
    {
      sku: 'NEW-VAR',
      externalId: 'ext-new-var',
      price: 1500,
      salePrice: 0,
      isOnSale: false,
      manageStock: true,
      attributes: [{ name: 'Size', value: 'XL' }],
    },
  ],
  changes: [{ _id: 'variant_001', changes: { price: 1200 } }],
  deletions: ['variant_old_001'],
});
console.log(result.added, result.changed, result.deleted);
```
