# getActiveOutlet

Returns the outlet currently active on the station (`activeShell.outlet`), or `null`.

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

Outlet changes can be observed by subscribing to the `set-active-outlet` topic (a pub/sub event, not a command).
