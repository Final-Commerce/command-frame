# refreshResource

Asks the Manage host to invalidate cached data for a named resource (e.g. React Query invalidation).

## Parameters

### `RefreshResourceParams`

```typescript
interface RefreshResourceParams {
  resource: string;
}
```

- `resource` (string, required): Identifier the host uses for cache keys (often matches a Refine resource name).

## Response

```typescript
interface RefreshResourceResponse {
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

await command.refreshResource({ resource: 'products' });
```

## Notes

- Optional on `ManageProviderActions`; hosts that do not implement it will not refresh data.
