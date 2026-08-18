# getActiveStation

Returns the active station document for the current POS context, or `null`.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `success`   | `boolean` | |
| `station`   | [`CFActiveStation`](../../types/README.md#cfactivestation) ` \| null` | |
| `timestamp` | `string` | |

## Example

```typescript
const { station } = await command.getActiveStation();
```

The active station is host-owned selection context, set by the host/shell during selection. There is no `setActiveStation` command.
