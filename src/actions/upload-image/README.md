# uploadImage

Uploads an image file for use on a product or variant.

> **Render-side command.** Handled by kaching's command-frame handler — a low-level building block for product/variant image management.

## Parameters

### `UploadImageParams`

```typescript
interface UploadImageParams {
  file: { data: ArrayBuffer; name: string; mimeType: string };
}
```

| Param  | Type                                                    | Required | Notes                                  |
| ------ | ------------------------------------------------------- | -------- | -------------------------------------- |
| `file` | `{ data: ArrayBuffer; name: string; mimeType: string }` | yes      | The file to upload, as a transferable. |

**Why `data` is an `ArrayBuffer` and not a DOM `File`:** parameters cross the iframe boundary via `postMessage`. `File`/`Blob` objects don't survive that trip intact, but `ArrayBuffer`s are [transferable objects](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects) — `postMessage` can move them between frames efficiently (zero-copy) instead of structured-cloning the whole payload. Callers should read the `File` into an `ArrayBuffer` (e.g. `await file.arrayBuffer()`) before calling this action.

## Response

### `UploadImageResponse`

```typescript
interface UploadImageResponse {
  success: boolean;
  attachmentId: string;
  url: string;
  originalUrl?: string;
  path?: string;
  name: string;
  mimeType: string;
  timestamp: string;
}
```

- `attachmentId`: the hub-api attachment row's `_id` — this is what [`deleteImage`](../delete-image/README.md) takes to remove the upload. Keep it if the image may need to be deleted later.
- `url`: the **public, resized** image URL. Store **this** string in `product.images[]` / `variant.images[]` — those arrays hold plain URL strings, not attachment objects.
- `originalUrl`: the pre-resize upload URL, when the host exposes one. Not what you store on products/variants.
- `path`: host-side storage path/key for the file, when available.

### Latency: server-side resize poll (~15s)

Host-side, the upload is followed by a resize step: the file lands in storage, then the host polls until a resized public asset is ready before resolving this call. Expect this action to take **up to ~15 seconds** in real (non-mock) environments — callers should show upload progress/loading state and use a generous timeout rather than assuming a fast round-trip.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const file = fileInput.files[0];
const data = await file.arrayBuffer();

const result = await command.uploadImage({
  file: { data, name: file.name, mimeType: file.type },
});

console.log(result.url); // store on product.images[] / variant.images[]
```

## Notes

- In mock mode there is no real storage/resize pipeline: the mock base64-encodes the `ArrayBuffer` into a `data:` URL (capped at 1MB — larger buffers get a placeholder `https://example.com/images/mock/...` URL instead) and records the upload in an in-memory mock image list consumed by [`getImages`](../get-images/README.md) / [`deleteImage`](../delete-image/README.md).
