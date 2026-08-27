# getStations

Retrieves POS stations for the current company. Optionally filter by outlet.

> **Manage-scoped command.** This is a Manage administrative command (station/outlet admin), not a kaching POS-runtime command — there is no kaching command-frame handler for it.

## Parameters

### `GetStationsParams` (optional)

```typescript
interface GetStationsParams {
    outletId?: string;
}
```

#### `outletId` (optional)

Filter stations by outlet ID. If omitted, returns all stations for the company.

## Response

### `GetStationsResponse`

```typescript
interface GetStationsResponse {
    stations: CFActiveStation[];
    timestamp: string;
}
```

#### `stations` ([CFActiveStation](../../types/README.md#cfactivestation)[])

Array of station objects. Each station contains:

- `_id` -- Station ID
- `name` -- Station name
- `status` -- Station status (e.g. `'open'`)
- `sequenceNumber` -- Sequence number for ordering
- `stripeTerminalId` -- Stripe terminal identifier

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// All stations
const result = await command.getStations();

// Stations for a specific outlet
const filtered = await command.getStations({ outletId: 'outlet_123' });
filtered.stations.forEach((s) => {
    console.log(s.name, s.status);
});
```
