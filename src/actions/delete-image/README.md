# deleteImage

Deletes an uploaded image attachment.

**Hard delete.** Unlike catalog entities (products, categories, attributes — spec §6.6, all soft-deleted), an image attachment is deleted for real, host-side: the file is removed from cloud storage (GCS) **and** its record is deleted — there is no recovering it afterwards. Removing a URL from `product.images[]` / `variant.images[]` is a separate, unrelated operation (a plain product/variant edit) — this action only affects the underlying attachment/file.

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for product/variant image management.

## Parameters

### `DeleteImageParams`

```typescript
interface DeleteImageParams {
  attachmentId: string;
}
```

| Param          | Type     | Required | Notes                                                                                                                                  |
| -------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `attachmentId` | `string` | yes      | The `_id` of the image attachment to delete (see [`getImages`](../get-images/README.md) / [`uploadImage`](../upload-image/README.md)). |

## Response

### `DeleteImageResponse`

```typescript
interface DeleteImageResponse {
  success: boolean;
  attachmentId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.deleteImage({ attachmentId: '64abc123def456' });
console.log(result.success);
```

## Notes

- In mock mode this splices the matching entry out of the in-memory mock image list (no real storage involved).
