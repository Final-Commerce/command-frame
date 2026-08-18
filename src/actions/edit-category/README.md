# editCategory

Updates a category's metadata for an existing category.

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for category catalog management.

## Parameters

### `EditCategoryParams`

```typescript
interface EditCategoryParams {
  categoryId: string;
  changes: {
    name?: string;
    description?: string;
    image?: string;
    parentId?: string | null;
    menuOrder?: number;
  };
}
```

| Param                 | Type             | Required | Notes                                     |
| --------------------- | ---------------- | -------- | ----------------------------------------- |
| `categoryId`          | `string`         | yes      | The ID of the category to update.         |
| `changes`             | `object`         | yes      | Only provided fields are changed.         |
| `changes.name`        | `string`         | no       |                                           |
| `changes.description` | `string`         | no       |                                           |
| `changes.image`       | `string`         | no       |                                           |
| `changes.parentId`    | `string \| null` | no       | Pass `null` to clear the parent category. |
| `changes.menuOrder`   | `number`         | no       |                                           |

## Response

### `EditCategoryResponse`

```typescript
interface EditCategoryResponse {
  success: boolean;
  category: CFCategory;
  timestamp: string;
}
```

Returns the updated [`CFCategory`](../../types/README.md#cfcategory) document.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.editCategory({
  categoryId: '64abc123def456',
  changes: { name: 'Cold Beverages' },
});
console.log(result.category.name); // "Cold Beverages"
```
