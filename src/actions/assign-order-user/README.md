# assignOrderUser

Assigns a user to an order — e.g. the delivery driver — or unassigns it, with an optional `label` saying why (`'delivery'`, `'kitchen'`, anything). The order keeps a record of everyone who had it in `assignedUser`, a list of `{ userId, assignedAt, label?, unassignedAt? }` entries, oldest first, separate from `posData.employee` (the user who rang the order up). Entries without `unassignedAt` are the current assignees — at most one per label: assigning someone new under a label ends the current assignee with that label (their entry stays, with `unassignedAt` set) and adds the new one. The assignment syncs with the order, so other stations see it in their `orders` / `order-updated` events.

## Parameters

`params: AssignOrderUserParams`

| Parameter | Type             | Required | Description                                                                                                                                        |
| :-------- | :--------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string`         | `false`  | Order to assign. Omit to target the live cart's order — which must already exist (a cart becomes an order when it's parked, paid or transitioned). |
| `userId`  | `string \| null` | `true`   | User to assign, or `null` to unassign.                                                                                                             |
| `label`   | `string \| null` | `false`  | Why the user is assigned, e.g. `'delivery'`. Omit for an unlabeled assignment. When unassigning, ends only this label's assignee; omit to end all. |

## Response

`Promise<AssignOrderUserResponse>`

| Field          | Type                    | Description                                                                                                                                                          |
| :------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `success`      | `boolean`               | `true` if the assignment was saved.                                                                                                                                  |
| `orderId`      | `string`                | The order that was updated.                                                                                                                                          |
| `assignedUser` | `CFOrderAssignedUser[]` | Everyone who has had the order after the call, oldest first: `{ userId, assignedAt, label?, unassignedAt? }` (ISO 8601). Entries without `unassignedAt` are current. |
| `timestamp`    | `string`                | ISO date string of when the action occurred.                                                                                                                         |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Driver POS: claim a delivery
const { user } = await command.getActiveUser();
if (!user) throw new Error('No one is signed in');
await command.assignOrderUser({ orderId: 'order-id-123', userId: user.id, label: 'delivery' });

// "My deliveries"
const { orders } = await command.getOrders({
  assignedUserId: user.id,
  assignedUserLabel: 'delivery',
  fulfillmentState: 'partially_fulfilled',
});

// Deliveries nobody has claimed yet
const { orders: unclaimed } = await command.getOrders({
  orderType: 'delivery',
  assignedUserId: null,
  assignedUserLabel: 'delivery',
});

// Who has it now, and who had it before
const current = order.assignedUser?.filter((a) => !a.unassignedAt) ?? [];
const history = order.assignedUser ?? [];

// Hand it back — the driver's entry stays in the record, ended
await command.assignOrderUser({ orderId: 'order-id-123', userId: null, label: 'delivery' });
```

## Error Handling

Throws when:

- `userId` is neither a string nor `null`.
- The user doesn't exist or is deleted (`User with ID <id> not found`).
- `orderId` is given but the order can't be found (`Order with ID <id> not found`).
- `orderId` is omitted and the live cart isn't an order yet.

## Notes

- Assigning the user who already has the order under the same label is a no-op: `assignedAt` keeps the original time. A user who had it earlier and gets it back gets a new entry.
- Labels are compared exactly after trimming; a blank label is unlabeled. Different labels don't replace each other, so a cook (`'kitchen'`) and a driver (`'delivery'`) can both be current.
- Orders assigned before the list existed carry a single `{ userId, assignedAt }` object instead of a list until they are next assigned — read it as a one-entry list (`[].concat(order.assignedUser ?? [])`). The first assign or unassign converts it.
- The assignment doesn't change the order's payment or fulfillment state — move the order with [`applyTransition`](../apply-transition/README.md) separately.
- Filter by current assignee with [`getOrders`](../get-orders/README.md)' `assignedUserId` and `assignedUserLabel`.

## Events

- `orders` / `order-updated` with the updated order. Other stations receive the same event once the order syncs.
