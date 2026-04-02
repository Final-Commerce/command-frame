# getTaxTables

Returns tax tables configured for the current company (tables and linked rate metadata).

## Parameters

None.

## Response

### `GetTaxTablesResponse`

```typescript
interface GetTaxTablesResponse {
  taxTables: TaxTablePayload[];
  timestamp: string;
}
```

`TaxTablePayload` contains `_id`, `name`, and `rates` (`TaxRatePayload[]` with `_id`, `name`, `isCompounding`).

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { taxTables } = await command.getTaxTables();
```

## Notes

- Optional on `ManageProviderActions`; hosts without tax APIs may omit this action.
