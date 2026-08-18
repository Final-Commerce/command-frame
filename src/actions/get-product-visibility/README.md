# getProductVisibility

Retrieves a product's per-outlet catalog visibility (CV) state.

CV semantics (spec §6.4): the returned outlet ids are the ones where the product is **hidden** — presence in the list means hidden, absence means visible.

## Parameters

### `GetProductVisibilityParams`

```typescript
interface GetProductVisibilityParams {
  productId: string;
}
```

| Param       | Type     | Required | Notes                                  |
| ----------- | -------- | -------- | -------------------------------------- |
| `productId` | `string` | yes      | The product to look up visibility for. |

## Response

### `GetProductVisibilityResponse`

```typescript
interface GetProductVisibilityResponse {
  success: boolean;
  hiddenOutletIds: string[];
  timestamp: string;
}
```

`hiddenOutletIds` lists the outlets where this product is hidden. An outlet not in this list is visible there.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getProductVisibility({ productId: '64abc123def456' });
console.log(result.hiddenOutletIds);
```
