# setOrderType

Labels an order with a type — `takeout`, `pickup`, `delivery`, `dine_in`, or anything the merchant uses. Stored on the order as `orderType`, so it syncs with the order to other stations, and [`getOrders`](../get-orders/README.md) can filter by it.

`orderType` is **a label only**: free text, optional, and nothing in the POS logic reads it. Payment, fulfillment and state rules behave the same whatever the type is.

## Parameters

`params: SetOrderTypeParams`

| Parameter   | Type             | Required | Description                                                                                                                                    |
| :---------- | :--------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderId`   | `string`         | `false`  | Order to label. Omit to target the live cart — including a cart that isn't an order yet; the type is carried onto the order when it's created. |
| `orderType` | `string \| null` | `true`   | Any non-empty label (surrounding whitespace is trimmed), or `null` to clear it.                                                                |

## Response

`Promise<SetOrderTypeResponse>`

| Field       | Type             | Description                                                       |
| :---------- | :--------------- | :---------------------------------------------------------------- |
| `success`   | `boolean`        | `true` if the type was saved.                                     |
| `orderId`   | `string \| null` | The order updated, or `null` when the live cart has no order yet. |
| `orderType` | `string \| null` | The type after the call.                                          |
| `timestamp` | `string`         | ISO date string of when the action occurred.                      |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Main POS, while building the order
await command.setOrderType({ orderType: 'delivery' });

// Driver POS: delivery orders ready to go
const { orders } = await command.getOrders({ orderType: 'delivery', fulfillmentState: 'in_progress' });

// Clear it
await command.setOrderType({ orderId: 'order-id-123', orderType: null });
```

## Error Handling

Throws when:

- `orderType` is an empty string or not a string (and not `null`).
- `orderId` is given but the order can't be found (`Order with ID <id> not found`).

## Notes

- Values are not checked against a list — agree on spelling across your flows (`delivery`, not `Delivery`); `getOrders` matches exactly.
- The type on the live cart is cleared with the cart (clear cart, new sale). Resuming an order loads that order's own type.

## Events

- `orders` / `order-updated` with the updated order, when an order was updated (not for a cart with no order yet).
