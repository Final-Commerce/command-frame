# getActiveSession

Returns the open cash-register session for the station, or `null` if none.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `success`   | `boolean` | `true` on success. |
| `session`   | [`CFSession`](../../types/README.md#cfsession) ` \| null` | The open cash-register session, or `null` if none. |
| `timestamp` | `string` | ISO timestamp. |

## Example

```typescript
const { session } = await command.getActiveSession();
```

See the [`set-active-session`](../../pubsub/topics/session/set-active-session/README.md) event.
