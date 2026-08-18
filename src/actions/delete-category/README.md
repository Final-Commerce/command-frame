# deleteCategory

Deletes a category from the catalog.

Soft delete (spec §6.6).

> **Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `DeleteCategoryParams`

```typescript
interface DeleteCategoryParams {
  categoryId: string;
}
```

| Param        | Type     | Required | Notes                             |
| ------------ | -------- | -------- | --------------------------------- |
| `categoryId` | `string` | yes      | The ID of the category to delete. |

## Response

### `DeleteCategoryResponse`

```typescript
interface DeleteCategoryResponse {
  success: boolean;
  categoryId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.deleteCategory({ categoryId: '64abc123def456' });
console.log(result.success);
```
