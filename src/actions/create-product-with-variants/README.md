# createProductWithVariants

The deerlake-parity nested create: product + variants + inventory (and, optionally, catalog visibility) in a single call. Replicates deerlake's `createProductForFrontEnd` exactly (spec §3.3.1) — this is the command the create-product popup should call, not `addProduct` + `editProductVariants` chained by hand.

> **Render-side command.** Handled by kaching's command-frame handler. The write is **app-level atomic**: kaching builds every doc up front (product, variant(s), inventory rows, optional CV exceptions) in a build buffer, then either commits all of them together or discards all of them — never a partial product.

## Parameters

### `CreateProductWithVariantsParams`

```typescript
interface CreateProductVariantInput {
  _id?: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  salePrice?: number;
  images?: string[];
  manageStock?: boolean;
  allowBackorder?: boolean;
  inventory?: { outletId: string; stock: number }[];
  attributes?: { name: string; value: string }[];
}

interface CreateProductWithVariantsParams {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  costPrice?: number;
  salePrice?: number;
  taxable?: boolean;
  taxTable?: string;
  trackInventory?: boolean;
  manageStock?: boolean;
  categories?: string[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  images?: string[];
  outlets?: string[];
  variants?: CreateProductVariantInput[];
}
```

| Param                     | Type                                | Required                       | Notes                                                                                                                                                  |
| ------------------------- | ----------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                    | `string`                            | yes                            | Product name.                                                                                                                                          |
| `description`             | `string`                            | no                             | Full description.                                                                                                                                      |
| `shortDescription`        | `string`                            | no                             | Short/teaser description.                                                                                                                              |
| `sku` / `barcode`         | `string`                            | no                             | Only meaningful for a **simple** product — see the §6.2 note below. Ignored on the product doc for variable products.                                  |
| `price`                   | `number`                            | yes when `variants` is omitted | Integer minor units. Seeds the simple product's mandatory default variant.                                                                             |
| `costPrice` / `salePrice` | `number`                            | no                             | Same simple-product routing as `price`.                                                                                                                |
| `taxable`                 | `boolean`                           | no                             | Input-only convenience flag; when `false`, `taxTable` is not applied. Not a persisted field on the product doc.                                        |
| `taxTable`                | `string`                            | no                             | Tax table id. Only set on the product when provided (§6.1).                                                                                            |
| `trackInventory`          | `boolean`                           | no                             | Whether stock is tracked at all for this product; combines with `manageStock` to seed each inventory row's flag.                                       |
| `manageStock`             | `boolean`                           | no                             | Default `manageStock` for every seeded inventory row (§6.3), overridable per variant via `CreateProductVariantInput.manageStock`. Defaults to `false`. |
| `categories`              | `string[]`                          | no                             | Category ids. Default `[]`.                                                                                                                            |
| `tags`                    | `string[]`                          | no                             | Free-form tags.                                                                                                                                        |
| `status`                  | `'active' \| 'inactive' \| 'draft'` | no                             | Defaults to `'active'`.                                                                                                                                |
| `images`                  | `string[]`                          | no                             | Image URLs (see `uploadImage`). Default `[]`.                                                                                                          |
| `outlets`                 | `string[]`                          | no                             | See CV reconcile below.                                                                                                                                |
| `variants`                | `CreateProductVariantInput[]`       | no                             | Present ⇒ variable product. Omitted/empty ⇒ simple product (see §6.2 below).                                                                           |

`CreateProductVariantInput.inventory` is an optional hint only — actual inventory rows are always dense-seeded per the §6.3 rule below, regardless of what's passed here.

### §6.1/§6.2/§6.3 defaults (byte-level parity)

- **Product type:** `variants.length > 0 ? 'variable' : 'simple'` (§6.1). There is no way to create a `'variable'` product with zero variants through this command.
- **Simple product ⇒ 1 mandatory default variant (§6.2):** when `variants` is omitted or empty, exactly one variant is created carrying `price`/`costPrice`/`salePrice`/`sku`/`barcode` straight from the top-level payload (these fields live on the **variant**, not the product doc, once persisted — the product-level `sku`/`barcode` params exist purely as the simple-product convenience input). `price` is required in this path.
- **Dense-seed inventory across ALL active outlets (§6.1/§6.3):** every live variant gets one inventory row per **active** company outlet (`isDeleted:false`) — never only the outlets named in `outlets` or in a variant's own `inventory` hint. This is a deliberate resurface-bug guard (hub-api parity, `product.service.ts:410-416`): an outlet added to the company later must not silently exclude products created before it existed. Every seeded row starts at `quantity: 0`; `manageStock` is `manageStock` (top-level) unless a variant input overrides it.
- **`outlets` ⇒ CV reconcile (§3.3.4):** a non-empty `outlets[]` reconciles catalog-visibility so the product is visible **only** at those outlets (see `setProductOutlets` for the exact hide/show algorithm). Omitted or empty `outlets[]` skips CV entirely — the product is visible everywhere, which is the common case.

## Response

### `CreateProductWithVariantsResponse`

```typescript
interface CreateProductWithVariantsResponse {
  success: boolean;
  product: CFProduct;
  timestamp: string;
}
```

Returns the created product **with its variants populated** (unlike `addProduct`, which returns an empty `variants: []`).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Simple product — one mandatory default variant, no attributes
const simple = await command.createProductWithVariants({
  name: 'House Blend Coffee',
  sku: 'COFFEE-001',
  price: 450,
  manageStock: true,
});
console.log(simple.product.variants.length); // 1

// Variable product — combos usually come from previewVariants
const variable = await command.createProductWithVariants({
  name: 'T-Shirt',
  manageStock: true,
  variants: [
    {
      name: 'Red / S',
      price: 1500,
      attributes: [
        { name: 'Color', value: 'Red' },
        { name: 'Size', value: 'S' },
      ],
    },
    {
      name: 'Blue / M',
      price: 1500,
      attributes: [
        { name: 'Color', value: 'Blue' },
        { name: 'Size', value: 'M' },
      ],
    },
  ],
});

// Scoped to two outlets — everywhere else gets a CV "hidden" exception
await command.createProductWithVariants({
  name: 'Airport-Only Snack',
  price: 300,
  outlets: ['outlet_airport_1', 'outlet_airport_2'],
});
```
