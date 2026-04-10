# getActiveSession

Returns the open cash-register session for the station, or `null` if none.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `session`   | [`CFSession`](../../types/README.md#cfsession) ` \| null` | |

## Example

```typescript
const { session } = await command.getActiveSession();
```

See [`setActiveSession`](../set-active-session/README.md).
