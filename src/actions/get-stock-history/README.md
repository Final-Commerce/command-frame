# getStockHistory

Retrieves the stock-changes audit trail (spec §6.5) for a product, newest first.

## Parameters

### `GetStockHistoryParams`

```typescript
interface GetStockHistoryParams {
  productId: string;
  variantId?: string;
  outletIds?: string[];
  actions?: string[];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
```

| Param       | Type       | Required | Notes                                       |
| ----------- | ---------- | -------- | ------------------------------------------- |
| `productId` | `string`   | yes      | The product to fetch the audit trail for.   |
| `variantId` | `string`   | no       | Narrow to a single variant.                 |
| `outletIds` | `string[]` | no       | Narrow to one or more outlets.              |
| `actions`   | `string[]` | no       | Narrow to specific `specificAction` values. |
| `startDate` | `string`   | no       | ISO date lower bound (inclusive).           |
| `endDate`   | `string`   | no       | ISO date upper bound (inclusive).           |
| `limit`     | `number`   | no       | Page size.                                  |
| `offset`    | `number`   | no       | Page offset.                                |

## Response

### `GetStockHistoryResponse`

```typescript
interface CFStockChange {
  _id: string;
  productId: string;
  variantId: string;
  outletId: string;
  userId?: string;
  baseAction: 'ADD' | 'REMOVE' | 'RECOUNT' | 'SKIP';
  specificAction: string;
  quantity: number;
  updatedQuantity: number;
  createdAt?: string;
}

interface GetStockHistoryResponse {
  success: boolean;
  entries: CFStockChange[];
  total: number;
  timestamp: string;
}
```

`entries` is ordered newest first. `baseAction` is the coarse stock-enum bucket (spec §6.5); `specificAction` is the finer-grained reason string.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getStockHistory({ productId: '64abc123def456', limit: 20 });
console.log(result.entries, result.total);
```
