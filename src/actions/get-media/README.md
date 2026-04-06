# getMedia

Lists media library items from the Manage host (pagination and filters are host-defined).

## Parameters

### `GetMediaParams` (all optional)

```typescript
interface GetMediaParams {
  search?: string;
  mimeType?: string[];
  folder?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "filename" | "size" | "title";
  sortDir?: "asc" | "desc";
}
```

## Response

### `GetMediaResponse`

```typescript
interface GetMediaResponse {
  items: MediaItemPayload[];
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
}
```

See `MediaItemPayload` in `./types.ts` for item fields.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getMedia({ page: 1, pageSize: 20, search: 'logo' });
```

## Notes

- Optional on `ManageProviderActions`; not all hosts expose a media library.
