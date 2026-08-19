# updateProductBundle

The edit-page Save: bundles product scalar changes, variant changes/additions/deletions, and an optional outlet-visibility reconcile into one atomic call (spec §3.3.2).

> **Render-side command.** Handled by kaching's command-frame handler. Like `createProductWithVariants`, this is **app-level atomic** via kaching's build buffer — every write in the bundle commits together, or none of them do.

## Parameters

### `UpdateProductBundleParams`

```typescript
interface UpdateProductBundleParams {
  productId: string;
  productChanges?: EditProductParams['changes'];
  variantChanges?: { _id: string; changes: Partial<CFProductVariant> }[];
  variantAdditions?: CreateProductVariantInput[];
  variantDeletions?: string[];
  outlets?: string[];
}
```

| Param              | Type                                                    | Required | Notes                                                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`        | `string`                                                | yes      | The product to update.                                                                                                                                                                                   |
| `productChanges`   | `EditProductParams['changes']`                          | no       | Product-level scalar fields (name, description, shortDescription, categories, taxTable, images, status, sku, barcode, tags). Attributes are **never** set here — attribute values live on variants only. |
| `variantChanges`   | `{ _id: string; changes: Partial<CFProductVariant> }[]` | no       | Per-variant field diffs — the direct output shape of `computeVariantChanges`.                                                                                                                            |
| `variantAdditions` | `CreateProductVariantInput[]`                           | no       | New variants to add (full docs). A non-empty list flips the product's `productType` to `'variable'`. Deduped by combo upstream (`previewVariants`).                                                      |
| `variantDeletions` | `string[]`                                              | no       | Variant ids to soft-delete — cascades to soft-deleting those variants' inventory rows (§6.6).                                                                                                            |
| `outlets`          | `string[]`                                              | no       | `undefined` leaves visibility untouched; an array (including `[]`) reconciles CV to exactly that outlet set — same algorithm as `setProductOutlets`. Never persisted on the product doc itself.          |

### Validation (host-enforced)

- `variantChanges[]._id` and every `variantDeletions` id must belong to **this
  product's** live variants — a stray id from another product rejects the whole
  bundle (cross-product write protection).
- `variantAdditions` are validated like create's variants: integer minor-unit
  money (`price` required, `costPrice`/`salePrice` when present), attributes
  need both `name` and `value`, inventory seeds need `outletId` + integer
  `stock`, and duplicate attribute combinations within the payload reject.
- Any rejection happens **before** the atomic write — nothing lands, nothing
  syncs.

### Parity notes (spec §3.3.2)

- **Additions dense-seed inventory** across all active outlets, same rule as `createProductWithVariants` (§6.1/§6.3) — never only the outlets in `outlets`.
- **Simple-product SKU/barcode routing:** for a product with exactly one live variant, `sku`/`barcode` are variant-level fields — pass them through `variantChanges` targeting that one variant, not `productChanges` (parity: deerlake `show.tsx:413-426` / FI-5617). This routing never applies once a product has more than one variant.
- **External products** (`source !== 'standalone'`, e.g. WooCommerce-synced): the writable whitelist narrows to `productChanges.taxTable` and `outlets` (plus the inventory seeds outlet changes imply) — everything else on the payload is ignored server-side.

Known limitation (mock, not visible in the real handler): `outlets` is accepted but silently ignored — the mock does not simulate the catalog-visibility reconcile (the hide/show exception algorithm described above). Only the real kaching command-frame handler performs it; the mock's returned `product` is unaffected by whatever is passed in `outlets`.

## Response

### `UpdateProductBundleResponse`

```typescript
interface UpdateProductBundleResponse {
  success: boolean;
  product: CFProduct;
  added: string[];
  changed: string[];
  deleted: string[];
  timestamp: string;
}
```

`added`/`changed`/`deleted` echo the variant ids actually written per bucket (same shape as `editProductVariants`'s response), so the caller can verify the outcome without re-reading `product.variants`.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.updateProductBundle({
  productId: '64abc123def456',
  productChanges: { name: 'House Blend Coffee (Large Batch)', status: 'active' },
  variantChanges: [{ _id: 'variant_001', changes: { price: 500 } }],
  variantAdditions: [{ name: 'Decaf', price: 500, attributes: [{ name: 'Roast', value: 'Decaf' }] }],
  variantDeletions: ['variant_old_002'],
  outlets: ['outlet_main'],
});

console.log(result.added, result.changed, result.deleted);
console.log(result.product.variants);
```
