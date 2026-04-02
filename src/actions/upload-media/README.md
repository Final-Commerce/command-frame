# uploadMedia

Uploads a file through the Manage host. Payload is base64-encoded body plus metadata.

## Parameters

### `UploadMediaParams`

```typescript
interface UploadMediaParams {
  base64: string;
  filename: string;
  mimeType: string;
  folder?: string;
}
```

- `base64`: Raw base64 (no `data:image/...;base64,` prefix unless the host documents otherwise).
- `filename`, `mimeType`: Required for the upload.
- Keep payloads within host limits; very large files may exceed postMessage limits.

## Response

### `UploadMediaResponse`

```typescript
interface UploadMediaResponse {
  success: boolean;
  url: string;
  id?: string | null;
  filename?: string;
  mimeType?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

await command.uploadMedia({
  base64: '...',
  filename: 'banner.png',
  mimeType: 'image/png',
  folder: 'extensions',
});
```

## Notes

- Optional on `ManageProviderActions`.
