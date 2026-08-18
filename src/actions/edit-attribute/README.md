# editAttribute

Updates an existing attribute: rename the `optionName` and/or replace its full option set.

Deerlake parity: `options`, when provided, is a **full replacement** of the option set — not a merge (spec §3.1).

> **Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `EditAttributeParams`

```typescript
interface EditAttributeParams {
  attributeId: string;
  optionName?: string;
  options?: { name: string; order: number }[];
}
```

| Param         | Type                                | Required | Notes                                                               |
| ------------- | ----------------------------------- | -------- | ------------------------------------------------------------------- |
| `attributeId` | `string`                            | yes      | The ID of the attribute to update.                                  |
| `optionName`  | `string`                            | no       | Renames the attribute.                                              |
| `options`     | `{ name: string; order: number }[]` | no       | **Full replacement** of the option set when provided (not a merge). |

## Response

### `EditAttributeResponse`

```typescript
interface EditAttributeResponse {
  success: boolean;
  attribute: CFAttribute;
  timestamp: string;
}
```

Returns the updated [`CFAttribute`](../../types/README.md#cfattribute) document.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.editAttribute({
  attributeId: '64abc123def456',
  options: [
    { name: 'S', order: 0 },
    { name: 'M', order: 1 },
    { name: 'L', order: 2 },
    { name: 'XL', order: 3 },
  ],
});
console.log(result.attribute.options);
```
