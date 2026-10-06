# assignOrderUser

Assigns a user to an order — e.g. the delivery driver — or unassigns it. The assignee is stored on the order as `assignedUser: { userId, assignedAt }`, separate from `posData.employee` (the user who rang the order up). One assignee at a time: assigning someone new replaces the current one. The assignment syncs with the order, so other stations see it in their `orders` / `order-updated` events.

## Parameters

`params: AssignOrderUserParams`

| Parameter | Type             | Required | Description                                                                                                                                        |
| :-------- | :--------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId` | `string`         | `false`  | Order to assign. Omit to target the live cart's order — which must already exist (a cart becomes an order when it's parked, paid or transitioned). |
| `userId`  | `string \| null` | `true`   | User to assign, or `null` to unassign.                                                                                                             |

## Response

`Promise<AssignOrderUserResponse>`

| Field          | Type                          | Description                                                                    |
| :------------- | :---------------------------- | :----------------------------------------------------------------------------- |
| `success`      | `boolean`                     | `true` if the assignment was saved.                                            |
| `orderId`      | `string`                      | The order that was updated.                                                    |
| `assignedUser` | `CFOrderAssignedUser \| null` | `{ userId, assignedAt }` after the call (`assignedAt` is ISO 8601), or `null`. |
| `timestamp`    | `string`                      | ISO date string of when the action occurred.                                   |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Driver POS: claim a delivery
const { user } = await command.getActiveUser();
if (!user) throw new Error('No one is signed in');
await command.assignOrderUser({ orderId: 'order-id-123', userId: user.id });

// "My deliveries"
const { orders } = await command.getOrders({ assignedUserId: user.id, fulfillmentState: 'partially_fulfilled' });

// Deliveries nobody has claimed yet
const { orders: unclaimed } = await command.getOrders({ orderType: 'delivery', assignedUserId: null });

// Hand it back
await command.assignOrderUser({ orderId: 'order-id-123', userId: null });
```

## Error Handling

Throws when:

- `userId` is neither a string nor `null`.
- The user doesn't exist or is deleted (`User with ID <id> not found`).
- `orderId` is given but the order can't be found (`Order with ID <id> not found`).
- `orderId` is omitted and the live cart isn't an order yet.

## Notes

- Assigning the user who is already assigned is a no-op: `assignedAt` keeps the original time.
- The assignment doesn't change the order's payment or fulfillment state — move the order with [`applyTransition`](../apply-transition/README.md) separately.
- Filter by assignee with [`getOrders`](../get-orders/README.md)' `assignedUserId`.

## Events

- `orders` / `order-updated` with the updated order. Other stations receive the same event once the order syncs.
