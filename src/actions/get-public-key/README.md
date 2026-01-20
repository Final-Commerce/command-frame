# getPublicKey

Retrieves the public key for the current company/environment.

## Parameters

None.

## Response

Returns a Promise that resolves to an object containing:

- `publicKey`: The public key string.

## Example

```typescript
const response = await command.getPublicKey();
console.log(response.publicKey);
```
