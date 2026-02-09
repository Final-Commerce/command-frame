# setSecretVal

Creates or updates a secret value by key. Secrets can be company-level (shared across extensions) or extension-level (scoped to a specific extension).

## Parameters

### `SetSecretValParams`

```typescript
interface SetSecretValParams {
  key: string;
  value: string;
  extensionId?: string;
}
```

#### `key` (required)

The secret key to create or update.

#### `value` (required)

The secret value to store. Stored securely by the parent application.

#### `extensionId` (optional)

When omitted, creates/updates a company-level secret. When provided, creates/updates a secret scoped to that extension.

## Response

### `SetSecretValResponse`

```typescript
interface SetSecretValResponse {
  success: boolean;
}
```

#### `success` (boolean)

`true` when the secret was stored successfully.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';
```

## Usage Examples

### Company-level secret

```typescript
const result = await command.setSecretVal({
  key: 'api-key',
  value: 'sk_live_xxxx'
});
console.log(result.success); // true
```

### Extension-level secret

```typescript
const result = await command.setSecretVal({
  key: 'webhook-url',
  value: 'https://example.com/webhook',
  extensionId: 'your-extension-id'
});
```

## Error Handling

- Throws an error if `key` or `value` is missing
- Throws an error if the parent frame is unavailable or the user/extension is not authorized to write secrets for the given scope
