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
import { command } from "@final-commerce/command-frame";

// Remove the first cart fee
await command.removeCartFee({ index: 0 });
```

## Pub/Sub

On success, the Render host publishes **`cart` / `cart-fee-removed`** with payload `{ feeIndex: number }` (same index you passed in). See [cart-fee-removed event](../../pubsub/topics/cart/cart-fee-removed/README.md).

## Error handling

- Throws if `index` is missing, not an integer, or negative.
- Throws if the cart has no `customFee` entries.
- Throws if `index` is greater than or equal to the number of fees.
