# setActiveStation

Loads a station by `stationId` and sets it as the active station.

## Parameters

| Field        | Type     | Required |
| :----------- | :------- | :------- |
| `stationId`  | `string` | Yes      |

## Response

Returns `station` ([`CFActiveStation`](../../types/README.md#cfactivestation)).

## Example

```typescript
await command.setActiveStation({ stationId: 'station_counter_1' });
```
