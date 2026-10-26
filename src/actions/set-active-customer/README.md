# setActiveCustomer

Sets the active customer on the POS by loading the customer document from local data using `customerId`.

## Parameters

| Field        | Type     | Required | Description     |
| :----------- | :------- | :------- | :-------------- |
| `customerId` | `string` | Yes      | Customer `_id`. |

## Response

`Promise<SetActiveCustomerResponse>` with `success`, `customer` ([`CFActiveCustomer`](../../types/README.md#cfactivecustomer)), and `timestamp`.

## Example Usage

```typescript
await command.setActiveCustomer({ customerId: '68a2b3c4d5e6f7a8b9c0d1e2' });
```

## Error Handling

Throws if `customerId` is missing or the customer is not found.

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `setActiveCustomer: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.
