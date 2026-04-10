# getActiveUser

Returns the employee (active user) signed into the POS, or `null`.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `user`      | [`CFActiveUser`](../../types/README.md#cfactiveuser) ` \| null` | |

## Example

```typescript
const { user } = await command.getActiveUser();
```

See [`setActiveUser`](../set-active-user/README.md).
