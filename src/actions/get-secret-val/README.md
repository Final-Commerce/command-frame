# getSecretVal

Retrieves the value of a secret by key. Secrets can be company-level (shared across extensions) or extension-level (scoped to a specific extension).

## Parameters

### `GetSecretValParams`

```typescript
interface GetSecretValParams {
  key: string;
  extensionId?: string;
}
```

#### `key` (required)

The secret key to look up.

#### `extensionId` (optional)

When omitted, looks up a company-level secret. When provided, looks up a secret scoped to that extension.

## Response

### `GetSecretValResponse`

```typescript
interface GetSecretValResponse {
  key: string;
  value: string;
}
```

#### `key` (string)

The requested key name (echoed back).

#### `value` (string)

The secret value. Treat as sensitive; do not log or expose in UI.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';
```

## Usage Examples

### Company-level secret

```typescript
const result = await command.getSecretVal({ key: 'api-key' });
console.log(result.value); // use securely, do not log in production
```

### Extension-level secret

```typescript
const result = await command.getSecretVal({
  key: 'webhook-url',
  extensionId: 'your-extension-id'
});
```

## Error Handling

- Throws an error if `key` is missing
- Throws an error if the secret is not found for the given key and scope
- Throws an error if the parent frame is unavailable or the user/extension is not authorized
