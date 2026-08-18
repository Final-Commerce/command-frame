# getAttributes

Retrieves all attributes (deerlake-style option sets, e.g. Size, Color) from the parent application's product catalog.

## Parameters

None.

## Response

### `GetAttributesResponse`

```typescript
interface GetAttributesResponse {
  success: boolean;
  attributes: CFAttribute[];
  timestamp: string;
}
```

`attributes` is the [`CFAttribute`](../../types/README.md#cfattribute)[] array.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getAttributes();
console.log(result.attributes);
```
