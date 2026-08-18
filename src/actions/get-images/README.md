# getImages

Retrieves all uploaded image attachments (e.g. previously uploaded via [`uploadImage`](../upload-image/README.md)).

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for product/variant image management.

## Parameters

None.

## Response

### `GetImagesResponse`

```typescript
interface CFImageAttachment {
  _id: string;
  name: string;
  url: string;
}

interface GetImagesResponse {
  success: boolean;
  images: CFImageAttachment[];
  timestamp: string;
}
```

`images` lists attachment records (id, name, public URL) — this is a media-library listing, not the `product.images[]` / `variant.images[]` fields themselves (those store plain URL strings, populated from `uploadImage`'s `url`).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getImages();
console.log(result.images);
```

## Notes

- In mock mode this returns the in-memory list populated by the [`uploadImage`](../upload-image/README.md) mock (data:/placeholder URLs), pruned by the [`deleteImage`](../delete-image/README.md) mock.
