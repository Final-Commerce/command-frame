# removeCartFee

Removes a cart-level fee by its index in `cart.customFee`. Matches the order of fees returned by `getCurrentCart` (oldest fee first at index `0`).

## Parameters

- `index` (number, required): Zero-based index of the fee to remove from `customFee`.

## Response

```typescript
{
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Remove the first cart fee
await command.removeCartFee({ index: 0 });
```

## Pub/Sub

On success, kaching publishes **`cart` / `cart-fee-removed`** with payload `{ feeIndex: number }` (same index you passed in). See [cart-fee-removed event](../../pubsub/topics/cart/cart-fee-removed/README.md).

## Error handling

- Throws if `index` is missing, not an integer, or negative.
- Throws if the cart has no `customFee` entries.
- Throws if `index` is greater than or equal to the number of fees.

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `removeCartFee: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.
