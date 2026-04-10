# getActiveStation

Returns the active station document for the current POS context, or `null`.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `station`   | [`CFActiveStation`](../../types/README.md#cfactivestation) ` \| null` | |

## Example

```typescript
const { station } = await command.getActiveStation();
```

See [`setActiveStation`](../set-active-station/README.md).
