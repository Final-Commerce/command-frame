# getInventory

Retrieves inventory rows for a product, optionally narrowed to a specific variant and/or outlet.

## Parameters

### `GetInventoryParams`

```typescript
interface GetInventoryParams {
  productId: string;
  variantId?: string;
  outletId?: string;
}
```

| Param       | Type     | Required | Notes                                 |
| ----------- | -------- | -------- | ------------------------------------- |
| `productId` | `string` | yes      | The product to look up inventory for. |
| `variantId` | `string` | no       | Narrow to a single variant.           |
| `outletId`  | `string` | no       | Narrow to a single outlet.            |

## Response

### `GetInventoryResponse`

```typescript
interface CFInventoryRow {
  productId: string;
  variantId: string;
  outletId: string;
  quantity: number;
  manageStock: boolean;
  isDeleted?: boolean;
}

interface GetInventoryResponse {
  success: boolean;
  rows: CFInventoryRow[];
  timestamp: string;
}
```

Each `CFInventoryRow` is a flattened product/variant/outlet inventory reading.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getInventory({ productId: '64abc123def456', outletId: 'outlet_main' });
console.log(result.rows);
```
