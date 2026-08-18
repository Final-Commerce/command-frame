# computeVariantChanges

Pure math — **no writes**. Diffs two variant arrays (the pre-edit snapshot vs. the operator's in-progress edits) and returns only what actually changed, per variant. Ports deerlake's `findVariantChanges` (`variant-utils.ts`).

> **Render-side command.** Handled by kaching's command-frame handler — a read-only helper so the blueprint UI never has to reimplement diff math client-side.

## Parameters

### `ComputeVariantChangesParams`

```typescript
interface ComputeVariantChangesParams {
  original: CFProductVariant[];
  edited: CFProductVariant[];
}
```

| Param      | Type                 | Required | Notes                                                                    |
| ---------- | -------------------- | -------- | ------------------------------------------------------------------------ |
| `original` | `CFProductVariant[]` | yes      | The variants as last loaded/saved.                                       |
| `edited`   | `CFProductVariant[]` | yes      | The variants after the operator's edits, matched to `original` by `_id`. |

## Response

### `ComputeVariantChangesResponse`

```typescript
interface ComputeVariantChangesResponse {
  success: boolean;
  changes: { _id: string; changes: Partial<CFProductVariant> }[];
  timestamp: string;
}
```

`changes` has one entry per variant that actually differs, `_id`-matched between `original` and `edited`. Only the fields that changed are included in each entry's `changes` object — fields diffed: `price`, `costPrice`, `salePrice`, `sku`, `barcode`, `isOnSale`, `images`, `attributes`, `manageStock`, `inventory`. Any `_id` present in `edited` but absent from `original` is skipped (that's a new variant — describe it via `previewVariants`/`variantAdditions`, not this command); any `_id` present only in `original` is likewise skipped (that's a deletion — pass it as a `variantDeletions` id, not through here).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.computeVariantChanges({
  original: currentVariants,
  edited: editedVariants,
});

console.log(result.changes);
// [{ _id: 'variant_001', changes: { price: 1200, manageStock: true } }]

// Feed straight into the orchestrator
await command.updateProductBundle({
  productId: '64abc123def456',
  variantChanges: result.changes,
});
```
