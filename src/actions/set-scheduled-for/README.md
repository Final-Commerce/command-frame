# setScheduledFor

Sets **when the customer wants the order** — a pizza ordered now for 7 pm, a catering pickup tomorrow at noon. Stored on the order as `scheduledFor`, so it syncs with the order to other stations, and [`getOrders`](../get-orders/README.md) can filter and sort by it.

No time (`null`, or never set) means **as soon as possible**. `scheduledFor` is separate from `createdAt` (when the order was placed) and `completedAt` (when it reached paid + fulfilled). Nothing in the POS logic acts on it — payment, fulfillment and state rules behave the same whatever the time is. What to do with a scheduled order (hold it off the kitchen board until 30 minutes before, show "due in 12 min") is the flow's choice.

## Parameters

`params: SetScheduledForParams`

| Parameter      | Type             | Required | Description                                                                                                                                                         |
| :------------- | :--------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `orderId`      | `string`         | `false`  | Order to schedule. Omit to target the live cart — including a cart that isn't an order yet; the time is carried onto the order when it's created.                   |
| `scheduledFor` | `string \| null` | `true`   | An ISO 8601 date-time **with `Z` or an offset** — `'2026-10-13T23:00:00.000Z'` or `'2026-10-13T19:00:00-04:00'` — or `null` for as soon as possible. Stored in UTC. |

## Response

`Promise<SetScheduledForResponse>`

| Field          | Type             | Description                                                                            |
| :------------- | :--------------- | :------------------------------------------------------------------------------------- |
| `success`      | `boolean`        | `true` if the time was saved.                                                          |
| `orderId`      | `string \| null` | The order updated, or `null` when the live cart has no order yet.                      |
| `scheduledFor` | `string \| null` | The time after the call, normalised to UTC ISO 8601 — or `null` (as soon as possible). |
| `timestamp`    | `string`         | ISO date string of when the action occurred.                                           |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Main POS: the customer wants it in two hours
const at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
await command.setScheduledFor({ scheduledFor: at });

// Kitchen: orders due in the next 30 minutes, soonest first
const now = new Date();
const { orders } = await command.getOrders({
  customStatusId: 'in-kitchen',
  scheduledTo: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
  sortBy: 'scheduledFor',
  sortDirection: 'ascending',
});

// Back to as soon as possible
await command.setScheduledFor({ orderId: 'order-id-123', scheduledFor: null });
```

## Error Handling

Throws when:

- `scheduledFor` is not an ISO 8601 date-time with `Z` or an offset (and not `null`). A time with no zone (`'2026-10-13T19:00:00'`) is refused — it would mean a different moment on every device.
- `orderId` is given but the order can't be found (`Order with ID <id> not found`).

## Notes

- **Times are stored in UTC.** Display them in the outlet's local time; send them with an offset or as UTC.
- A past time is accepted (e.g. correcting an order after the fact). Whether to warn about it is up to the flow.
- **Not locked by payment.** Changing the time doesn't change what the order is worth, so it stays editable on a paid order (see the paid-order lock in [`getCurrentCart`](../get-current-cart/README.md#paid-orders)).
- The time on the live cart is cleared with the cart (clear cart, new sale). Resuming an order loads that order's own time.
- Sorting: with `sortBy: 'scheduledFor'`, orders with no time (as soon as possible) come **first** when ascending.

## Events

- `orders` / `order-updated` with the updated order, when an order was updated (not for a cart with no order yet).
