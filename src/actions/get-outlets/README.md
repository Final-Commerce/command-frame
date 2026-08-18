# getOutlets

Retrieves the list of active outlets (store locations) for the current company — lightweight dropdown data (e.g. for catalog-visibility outlet pickers).

## Parameters

No parameters required.

## Response

### `GetOutletsResponse`

```typescript
interface CFOutletSummary {
  _id: string;
  name: string;
  isDeleted?: boolean;
}

interface GetOutletsResponse {
  success: boolean;
  outlets: CFOutletSummary[];
  timestamp: string;
}
```

#### `outlets` (`CFOutletSummary[]`)

Array of outlet summaries. Each outlet contains:

- `_id` -- Outlet ID
- `name` -- Outlet name
- `isDeleted` -- Present and `true` for soft-deleted outlets

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getOutlets();
result.outlets.forEach((outlet) => {
  console.log(outlet.name);
});
```
