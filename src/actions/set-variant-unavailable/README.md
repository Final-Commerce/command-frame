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
  variantId: string;
  outletId: string; // the active outlet the mark applies to
  unavailable: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

await command.setVariantUnavailable({ variantId: 'variant-123', unavailable: true });
await command.setVariantUnavailable({ variantId: 'variant-123', unavailable: false });
```

## Error Handling

The host needs a connection — the mark is written by the server and reaches every till through sync. It throws when:

- `variantId` or `unavailable` is missing, or the variant cannot be found;
- there is no active outlet or company;
- the device is offline, or the API call fails.

After success, the new state shows in `getProducts` once the change has synced back to the till.
