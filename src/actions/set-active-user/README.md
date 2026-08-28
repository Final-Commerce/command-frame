# setActiveUser

Loads a user by `userId` and sets them as the active POS user (where the host supports it).

## Parameters

| Field    | Type     | Required |
| :------- | :------- | :------- |
| `userId` | `string` | Yes      |

## Response

| Field       | Type                                                 |
| :---------- | :--------------------------------------------------- |
| `success`   | `boolean`                                            |
| `user`      | [`CFActiveUser`](../../types/README.md#cfactiveuser) |
| `timestamp` | `string`                                             |

## Errors

- Throws `User ID is required` if `userId` is omitted.
- Throws `User with ID ${userId} not found` if no matching user exists.

## Example

```typescript
await command.setActiveUser({ userId: 'user_mario' });
```
