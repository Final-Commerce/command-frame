# setActiveUser

Loads a user by `userId` and sets them as the active POS user (where the host supports it).

## Parameters

| Field     | Type     | Required |
| :-------- | :------- | :------- |
| `userId`  | `string` | Yes      |

## Response

Returns `user` ([`CFActiveUser`](../../types/README.md#cfactiveuser)).

## Example

```typescript
await command.setActiveUser({ userId: 'user_mario' });
```
