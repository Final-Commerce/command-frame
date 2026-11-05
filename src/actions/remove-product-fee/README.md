# removeProductFee

Removes ONE fee (by 0-based `index`, in the order fees were added) or — when `index` is omitted — clears ALL fees from a specific cart line item, or from the current active product if no `internalId` is given. Fees stack (`addProductFee` appends), so per-fee removal is how a single fee is edited: remove at its index, then re-add.

## Parameters

### `RemoveProductFeeParams`

```typescript
interface RemoveProductFeeParams {
  internalId?: string;
  index?: number;
}
```

#### `internalId` (optional)

The `internalId` of the cart line item to remove fee(s) from. This ID is returned in the response of `addProductToCart` or `getCurrentCart`. If omitted, the current active product context is used instead; if there is no `internalId` and no active product, the call throws.

#### `index` (optional)

0-based index of the single fee to remove, in the order the line's fees were added. Omit to clear ALL fees on the line (legacy behavior). An out-of-range index is a no-op.

## Response

### `RemoveProductFeeResponse`

```typescript
interface RemoveProductFeeResponse {
  success: boolean;
  internalId?: string; // Only present when internalId was passed in the request
  index?: number; // Echoed when a single fee was targeted
  timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// Clear all fees from a specific cart item
await command.removeProductFee({ internalId: 'abc123' });

// Clear all fees from the current active product
await command.removeProductFee();
```

## Error Handling

- Throws `Product with ID ${internalId} not found in cart` if `internalId` is provided but doesn't match any item currently in the cart.
- Throws `No active product. Provide internalId or use setActiveProduct first.` if `internalId` is omitted and there is no active product context to fall back to.

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `removeProductFee: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.

## Events

Publishes a `product-fee-removed` event on the `cart` topic with the updated product and (when provided) the `internalId` that was cleared.
