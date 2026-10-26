# removeNonRevenueItem

Removes a non-revenue line from the cart (for example a gift-card load / liability previously added via [`addNonRevenueItem`](../add-non-revenue-item/README.md)) by its `externalId`.

## Parameters

`RemoveNonRevenueItemParams`

| Field        | Type     | Required | Description                                                                                                                                                                                                |
| :----------- | :------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `externalId` | `string` | Yes      | Cart line id of the non-revenue item to remove (matches `cart.nonRevenueItems[].externalId` from [`getCurrentCart`](../get-current-cart/README.md), and the `externalId` returned by `addNonRevenueItem`). |

## Response

`Promise<RemoveNonRevenueItemResponse>`

| Field        | Type      | Description                                             |
| :----------- | :-------- | :------------------------------------------------------ |
| `success`    | `boolean` |                                                         |
| `externalId` | `string`  | The `externalId` that was removed (echoes the request). |
| `timestamp`  | `string`  | ISO time of the action.                                 |

## Example

```typescript
import { command } from '@final-commerce/command-frame';

await command.removeNonRevenueItem({ externalId: 'abc123' });
```

## Errors

- `"Non-revenue item externalId is required"` — `externalId` is missing/empty.
- `"No non-revenue items to remove from cart"` — the cart has no non-revenue items at all.
- `` `Non-revenue item with externalId ${externalId} not found in cart` `` — the cart has non-revenue items, but none match the given `externalId`.

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `removeNonRevenueItem: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.
