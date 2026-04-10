# setActiveSession

Loads a session by `sessionId` and sets it as the active register session.

## Parameters

| Field        | Type     | Required |
| :----------- | :------- | :------- |
| `sessionId`  | `string` | Yes      |

## Response

Returns `session` ([`CFSession`](../../types/README.md#cfsession)).

## Example

```typescript
await command.setActiveSession({ sessionId: 'sess_mock_1' });
```
