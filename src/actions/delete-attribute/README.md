# deleteAttribute

Deletes an attribute from the catalog.

Soft delete (spec §6.6).

> **Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

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
