# getSecretsKeys

Retrieves the list of secret keys available to the extension. Secrets can be company-level (shared across extensions) or extension-level (scoped to a specific extension).

## Parameters

### `GetSecretsKeysParams`

```typescript
interface GetSecretsKeysParams {
  extensionId?: string;
}
```

#### `extensionId` (optional)

When omitted, returns company-level secret keys. When provided, returns secret keys scoped to that extension.

## Response

### `GetSecretsKeysResponse`

```typescript
interface GetSecretsKeysResponse {
  keys: string[];
}
```

#### `keys` (string[])

Array of secret key names. Empty array if no secrets exist for the scope.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';
```

## Usage Examples

### Company-level secrets (all keys for the company)

```typescript
const result = await command.getSecretsKeys();
console.log(result.keys); // e.g. ['api-key', 'webhook-url']
```

### Extension-level secrets (keys for a specific extension)

```typescript
const result = await command.getSecretsKeys({
  extensionId: 'your-extension-id'
});
console.log(result.keys);
```

## Error Handling

- Throws an error if the parent frame is unavailable or the command fails
- May throw if the user/extension is not authorized to read secrets for the given scope
