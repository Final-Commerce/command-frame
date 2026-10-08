# getOrderStatuses

Returns the company's **order statuses** — the merchant-defined list a flow sets with [`setOrderStatus`](../set-order-status/README.md) (e.g. `In kitchen`, `Ready for pickup`, `Out for delivery`). Defined once per company and shared by every flow; managed through hub-api (`order-state-config/:companyId/statuses`).

## Parameters

None.

## Response

`Promise<GetOrderStatusesResponse>`

| Field       | Type                        | Description                                                  |
| :---------- | :-------------------------- | :----------------------------------------------------------- |
| `success`   | `boolean`                   |                                                              |
| `statuses`  | `CFOrderStatusDefinition[]` | In the order they were defined; empty when none are defined. |
| `timestamp` | `string`                    | ISO date string.                                             |

### `CFOrderStatusDefinition`

| Field                  | Type        | Description                                                                               |
| :--------------------- | :---------- | :---------------------------------------------------------------------------------------- |
| `id`                   | `string`    | Stable id — pass it to `setOrderStatus` and `getOrders({ customStatusId })`.              |
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

- Statuses sync to every station with the company's order state config; the list updates when the config changes.
