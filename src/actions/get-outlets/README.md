# getOutlets

Retrieves the list of outlets (store locations) for the current company.

## Parameters

No parameters required.

## Response

### `GetOutletsResponse`

```typescript
interface GetOutletsResponse {
    outlets: CFOutletInfo[];
    timestamp: string;
}
```

#### `outlets` (CFOutletInfo[])

Array of outlet objects. Each outlet contains:

- `_id` / `id` -- Outlet ID
- `name` -- Outlet name
- `address` -- Street address (string or structured object)
- `city`, `state`, `country` -- Location fields

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getOutlets();
result.outlets.forEach((outlet) => {
    console.log(outlet.name, outlet.city);
});
```
