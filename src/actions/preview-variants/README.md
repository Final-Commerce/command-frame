# previewVariants

Pure math — **no writes**. Generates the live variant-matrix preview table the create/edit flows render while an operator is picking attribute options (spec §3.2), porting deerlake's `generateVariants` / `computeVariantDiff` (`variant-utils.ts:89,162`).

> **Render-side command.** Handled by kaching's command-frame handler — a read-only helper so the blueprint UI never has to reimplement matrix/diff math client-side.

## Parameters

### `PreviewVariantsParams`

```typescript
interface PreviewVariantsParams {
  selectedOptions: { name: string; values: string[] }[];
  existingVariants?: CFProductVariant[];
  defaults: { price: number; outletIds: string[] };
}
```

| Param              | Type                                     | Required | Notes                                                                                                               |
| ------------------ | ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `selectedOptions`  | `{ name: string; values: string[] }[]`   | yes      | The attribute options currently selected in the UI (e.g. `[{ name: 'Color', values: ['Red', 'Blue'] }]`).           |
| `existingVariants` | `CFProductVariant[]`                     | no       | The product's current live variants, for diffing against the new option set (edit flow). Omit for a fresh create.   |
| `defaults`         | `{ price: number; outletIds: string[] }` | yes      | `price` seeds every newly-generated combo (integer minor units); `outletIds` seeds each new combo's inventory rows. |

## Response

### `PreviewVariantsResponse`

```typescript
interface PreviewVariantsResponse {
  success: boolean;
  additions: (Omit<CFProductVariant, '_id' | 'attributes'> & {
    _id: string;
    attributes: { name: string; value: string }[];
  })[];
  existing: CFProductVariant[];
  autoDeleteIds: string[];
  timestamp: string;
}
```

- **`additions`** — every combo in the cartesian product of `selectedOptions` that doesn't already exist, as ready-to-submit variant docs: a client-generated `_id` (stable per call, not a real ObjectId), `price`/`salePrice`/`manageStock` seeded from `defaults`, and `inventory` pre-seeded `outletIds.map(outletId => ({ outletId, stock: 0 }))`. `attributes` always carry concrete values (every combo is generated from `selectedOptions`), so the entries type-check directly against `CreateProductVariantInput.attributes`. Feed these straight into `createProductWithVariants.variants` or `updateProductBundle.variantAdditions`.
- **`existing`** — entries from `existingVariants` whose attribute combo still exists in the new `selectedOptions` set (matched by a stable dedup key, e.g. `"Color:Red|Size:S"` — order-independent, so renaming an option's declared order doesn't false-positive a diff). These survive unchanged; don't resubmit them as additions.
- **`autoDeleteIds`** — ids of attribute-less placeholder variants in `existingVariants` (the mandatory default variant on a still-simple product, §6.2) that become stale once `additions` lands — pass them as `variantDeletions` on the same save. Empty whenever `additions` is empty (nothing is replacing the placeholder yet).

Known limitation: an existing variant whose combo disappears from the newly generated set (a deselected attribute value, or `selectedOptions` emptied out) is **not** returned in any of the three arrays — it's not in `additions` (not new), not in `existing` (its combo no longer matches), and not in `autoDeleteIds` (that list is scoped to attribute-less placeholders only, §6.2). Callers must handle these orphaned variants explicitly — e.g. diff `existingVariants` against the returned `existing` + `autoDeleteIds` via `computeVariantChanges`, or delete them manually — before submitting `variantDeletions`.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const preview = await command.previewVariants({
  selectedOptions: [
    { name: 'Color', values: ['Red', 'Blue'] },
    { name: 'Size', values: ['S', 'M'] },
  ],
  existingVariants: [], // fresh create
  defaults: { price: 1500, outletIds: ['outlet_main'] },
});

console.log(preview.additions.length); // 4 combos: Red/S, Red/M, Blue/S, Blue/M
console.log(preview.autoDeleteIds); // [] — nothing existed to clean up yet

// Feed straight into the orchestrator
await command.createProductWithVariants({
  name: 'T-Shirt',
  variants: preview.additions.map(({ _id, ...variant }) => ({
    name: `${variant.attributes.map((a) => a.value).join(' / ')}`,
    price: variant.price,
    attributes: variant.attributes,
  })),
});
```
