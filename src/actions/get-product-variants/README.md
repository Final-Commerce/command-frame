# getProductVariants

Retrieves the variants of a single product.

## Parameters

### `GetProductVariantsParams`

```typescript
interface GetProductVariantsParams {
  productId: string;
  includeDeleted?: boolean;
}
```

| Param            | Type      | Required | Notes                                               |
| ---------------- | --------- | -------- | --------------------------------------------------- |
| `productId`      | `string`  | yes      | The product whose variants to retrieve.             |
| `includeDeleted` | `boolean` | no       | Include soft-deleted variants. Defaults to `false`. |

## Response

### `GetProductVariantsResponse`

```typescript
interface GetProductVariantsResponse {
  success: boolean;
  variants: CFProductVariant[];
  timestamp: string;
}
```

`variants` is the product's [`CFProductVariant`](../../types/README.md#cfproductvariant)[] array — soft-deleted variants are excluded unless `includeDeleted` is `true`.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getProductVariants({ productId: '64abc123def456' });
console.log(result.variants);
```
