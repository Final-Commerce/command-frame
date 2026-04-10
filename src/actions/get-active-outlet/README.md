# getActiveOutlet

Returns the outlet currently active on the station (`activeEntities.outlet`), or `null`.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `success`   | `boolean` | |
| `outlet`    | [`CFActiveOutlet`](../../types/README.md#cfactiveoutlet) ` \| null` | |
| `timestamp` | `string` | |

## Example

```typescript
const { outlet } = await command.getActiveOutlet();
```

See also [`setActiveOutlet`](../set-active-outlet/README.md).
