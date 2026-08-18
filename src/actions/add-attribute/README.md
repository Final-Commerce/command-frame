# addAttribute

Creates a new attribute (deerlake-style option set, e.g. Size, Color) in the parent application's product catalog.

Deerlake option semantics: an attribute is an `optionName` plus an ordered list of option values (spec §3.1).

> **Manage-only command.** This runs in the Manage admin app, not the kaching POS runtime — there is no kaching command-frame handler for it.

## Parameters

### `AddAttributeParams`

```typescript
interface AddAttributeParams {
  optionName: string;
  sortingOrder?: number;
  options: { name: string; order: number }[];
  _id?: string;
}
```

| Param          | Type                                | Required | Notes                                                               |
| -------------- | ----------------------------------- | -------- | ------------------------------------------------------------------- |
| `optionName`   | `string`                            | yes      | The attribute name, e.g. `"Size"`.                                  |
| `sortingOrder` | `number`                            | no       | Display/sort order among attributes. Defaults to `0`.               |
| `options`      | `{ name: string; order: number }[]` | yes      | Ordered option values, e.g. `[{ name: 'S', order: 0 }, ...]`.       |
| `_id`          | `string`                            | no       | Honor a caller-generated ObjectId (orchestrators pre-generate ids). |

## Response

### `AddAttributeResponse`

```typescript
interface AddAttributeResponse {
  success: boolean;
  attribute: CFAttribute;
  timestamp: string;
}
```

Returns the created [`CFAttribute`](../../types/README.md#cfattribute) document.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addAttribute({
  optionName: 'Size',
  options: [
    { name: 'S', order: 0 },
    { name: 'M', order: 1 },
    { name: 'L', order: 2 },
  ],
});
console.log(result.attribute.id);
```
