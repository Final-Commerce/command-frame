# getActiveUser

Returns the employee (active user) signed into the POS, or `null`.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `success`   | `boolean` | |
| `user`      | [`CFActiveUser`](../../types/README.md#cfactiveuser) ` \| null` | |
| `timestamp` | `string` | |

## Example

```typescript
const { user } = await command.getActiveUser();
```

## Events

Publishes the active user snapshot on the `users` channel:

| Channel  | Event             | Payload                          |
| :------- | :---------------- | :-------------------------------- |
| `users`  | `get-active-user` | `{ user: CFActiveUser \| null }` |

See [`setActiveUser`](../set-active-user/README.md).
