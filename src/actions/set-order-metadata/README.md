# setOrderMetadata

Sets or removes free-form key/value metadata on an order — e.g. a delivery note or gate code a driver flow on another station reads. (For the order type use [`setOrderType`](../set-order-type/README.md), which `getOrders` can filter by.) Metadata lives on the order itself (`order.metadata`), so it syncs with the order and arrives with its `orders` / `order-updated` events.

## Parameters

`params: SetOrderMetadataParams`

| Parameter  | Type                             | Required | Description                                                                                                                                                                     |
| :--------- | :------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `orderId`  | `string`                         | `false`  | Order to update. Omit to target the live cart — including a cart that isn't an order yet; the metadata is carried onto the order when it's created (park, payment, transition). |
| `metadata` | `Record<string, string \| null>` | `true`   | Keys to set (string value) or remove (`null`). Keys not listed are left untouched.                                                                                              |

## Response

`Promise<SetOrderMetadataResponse>`

| Field       | Type               | Description                                                       |
| :---------- | :----------------- | :---------------------------------------------------------------- |
| `success`   | `boolean`          | `true` if the metadata was saved.                                 |
| `orderId`   | `string \| null`   | The order updated, or `null` when the live cart has no order yet. |
| `metadata`  | `CFMetadataItem[]` | The full `{ key, value }` list after the update.                  |
| `timestamp` | `string`           | ISO date string of when the action occurred.                      |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// While building the order on the main POS
await command.setOrderMetadata({ metadata: { deliveryNote: 'Ring twice', gateCode: '4512' } });

// Later, on another station, by id
await command.setOrderMetadata({ orderId: 'order-id-123', metadata: { driver: 'Sam' } });

// Remove a key
await command.setOrderMetadata({ orderId: 'order-id-123', metadata: { driver: null } });

// Reading it back
const { orders } = await command.getOrders({ fulfillmentState: 'in_progress' });
const note = orders[0].metadata?.find((m) => m.key === 'deliveryNote')?.value;
```

## Error Handling

Throws when:

- `metadata` is missing or empty.
- A key is empty, or a value is neither a string nor `null`.
- `orderId` is given but the order can't be found (`Order with ID <id> not found`).

## Notes

- Values are strings. Store structured data as JSON if you need to.
- Metadata on the live cart is cleared with the cart (clear cart, new sale). Resuming an order loads that order's own metadata.
- Metadata can't be filtered on in `getOrders` — filter by state there and read `metadata` from the results.
- Other metadata (e.g. ecommerce sync entries with an `externalId`) is preserved.

## Events

- `orders` / `order-updated` with the updated order, when an order was updated (not for a cart with no order yet). Other stations receive the same event once the order syncs.
