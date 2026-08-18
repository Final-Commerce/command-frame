# addCategory

Creates a new category in the parent application's product catalog.

> **Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `AddCategoryParams`

```typescript
interface AddCategoryParams {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  menuOrder?: number;
  _id?: string;
}
```

| Param         | Type     | Required | Notes                                                               |
| ------------- | -------- | -------- | ------------------------------------------------------------------- |
| `name`        | `string` | yes      | The category name.                                                  |
| `description` | `string` | no       | Category description.                                               |
| `image`       | `string` | no       | Image URL.                                                          |
| `parentId`    | `string` | no       | Parent category id, for hierarchical categories.                    |
| `menuOrder`   | `number` | no       | Display/sort order.                                                 |
| `_id`         | `string` | no       | Honor a caller-generated ObjectId (orchestrators pre-generate ids). |

## Response

### `AddCategoryResponse`

```typescript
interface AddCategoryResponse {
  success: boolean;
  category: CFCategory;
  timestamp: string;
}
```

Returns the created [`CFCategory`](../../types/README.md#cfcategory) document.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addCategory({ name: 'Beverages' });
console.log(result.category.id);
```
