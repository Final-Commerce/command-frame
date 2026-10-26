# getOrderStatuses

Returns the running flow's **order statuses** — the list a flow sets with [`setOrderStatus`](../set-order-status/README.md) (e.g. `In kitchen`, `Ready for pickup`, `Out for delivery`). Authored in the flow builder and shipped with each deployed version, so a station returns the statuses of the version it is running.

## Parameters

None.

## Response

`Promise<GetOrderStatusesResponse>`

| Field       | Type                        | Description                                                       |
| :---------- | :-------------------------- | :---------------------------------------------------------------- |
| `success`   | `boolean`                   |                                                                   |
| `statuses`  | `CFOrderStatusDefinition[]` | In the order they were defined; empty when the flow defines none. |
| `timestamp` | `string`                    | ISO date string.                                                  |

### `CFOrderStatusDefinition`

| Field                  | Type        | Description                                                                               |
| :--------------------- | :---------- | :---------------------------------------------------------------------------------------- |
| `id`                   | `string`    | Durable id; survives a renamed key or label.                                              |
| `key`                  | `string`    | Pass it to `setOrderStatus({ key })` and `getOrders({ customStatusKey })`.                |
| `label`                | `string`    | What staff see.                                                                           |
| `color` / `icon`       | `string?`   | Optional display hints.                                                                   |
| `fulfillmentState`     | `string?`   | Setting the status moves the order to this fulfillment state. Absent = label-only status. |
| `requiresPaymentState` | `string[]?` | Setting the status fails unless the order's payment state is one of these.                |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { statuses } = await command.getOrderStatuses();
// Render one button per status
```

## Notes

- Statuses sync with the flow's versions; the list changes when the station moves to a version that defines different ones.
