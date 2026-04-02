# navigateTo

Requests the Manage host to navigate the SPA to an in-app path.

## Parameters

### `NavigateToParams`

```typescript
interface NavigateToParams {
  path: string;
}
```

- `path` (string, required): Must start with `/`. The host may reject paths outside an allowlist (e.g. only known app routes).

## Response

```typescript
interface NavigateToResponse {
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

await command.navigateTo({ path: '/products' });
```

## Notes

- Not all Manage hosts implement this action; check optional `ManageProviderActions.navigateTo`.
- Hosts should validate paths to avoid open redirects.
