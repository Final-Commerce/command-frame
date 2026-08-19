# deleteAttribute

Deletes an attribute from the catalog.

Soft delete (spec §6.6).

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for attribute catalog management.

## Parameters

### `DeleteAttributeParams`

```typescript
interface DeleteAttributeParams {
  attributeId: string;
}
```

| Param         | Type     | Required | Notes                              |
| ------------- | -------- | -------- | ---------------------------------- |
| `attributeId` | `string` | yes      | The ID of the attribute to delete. |

## Response

### `DeleteAttributeResponse`

```typescript
interface DeleteAttributeResponse {
  success: boolean;
  attributeId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.deleteAttribute({ attributeId: '64abc123def456' });
console.log(result.success);
```
