# generateAPIKey

Generates an API key for the specified company.

## Parameters

| Parameter     | Type       | Required | Description                                  |
| ------------- | ---------- | -------- | -------------------------------------------- |
| `companyId`   | `string`   | Yes      | The ID of the company to generate the key for |
| `name`        | `string`   | No       | Optional name/label for the API key          |
| `permissions` | `string[]` | No       | Optional list of permissions to grant        |

## Response

Returns a `Promise<GenerateAPIKeyResponse>`:

| Field    | Type     | Description               |
| -------- | -------- | ------------------------- |
| `apiKey` | `string` | The generated API key     |

## Example

```typescript
import { command } from "@final-commerce/command-frame";

const result = await command.generateAPIKey({
  companyId: "691df9c2047bfc55994d703c",
  name: "My Integration Key",
  permissions: ["read:products", "write:orders"],
});

console.log(result.apiKey);
```

## Types

```typescript
import type {
  GenerateAPIKey,
  GenerateAPIKeyParams,
  GenerateAPIKeyResponse,
} from "@final-commerce/command-frame";
```
