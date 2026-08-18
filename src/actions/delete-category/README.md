# deleteCategory

Deletes a category from the catalog.

Soft delete (spec §6.6).

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for category catalog management.

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
