# getStations

Retrieves POS stations for the current company. Optionally filter by outlet.

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

#### `stations` (CFActiveStation[])

Array of station objects. Each station contains:

- `_id` -- Station ID
- `name` -- Station name
- `status` -- Station status (e.g. `'active'`)
- `sequenceNumber` -- Sequence number for ordering

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
