# setVariantUnavailable

Marks a variant "can't be sold here right now" at the **active outlet**, or removes that mark. This is a manual
mark, independent of stock and of catalog visibility: the variant stays listed and keeps its stock. Booking
services are products too, so they are marked through their variant.

The mark is read back on every variant `getProducts` returns, as `unavailable: boolean`, and `addProductToCart`
refuses a marked variant with `success: false` and `reason: 'Marked unavailable'` — even when the variant allows
backorders.

## Parameters

- `variantId` (string, required): the variant to mark or unmark.
- `unavailable` (boolean, required): `true` marks it, `false` removes the mark.

## Response

```typescript
{
  success: boolean;
  reason?: string; // why the host refused, when success is false
  variantId: string;
  outletId: string; // the active outlet the mark applies to
  unavailable: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.setVariantUnavailable({ variantId: 'variant-123', unavailable: true });
if (!result.success) console.warn(result.reason);
await command.setVariantUnavailable({ variantId: 'variant-123', unavailable: false });
```

## Error Handling

The host needs a connection — the mark is written by the server and reaches every till through sync. It does not
throw: a failure resolves `{ success: false, reason }` when

- `variantId` or `unavailable` is missing, or `unavailable` is not a boolean;
- there is no active outlet or company;
- the variant cannot be found;
- the device is offline, or the API call fails.

Success means the server took the mark, not that `getProducts` shows it yet. When the mark syncs back to the till the
host publishes an event on the `products` topic; refetch `getProducts` on it to show the new state.
