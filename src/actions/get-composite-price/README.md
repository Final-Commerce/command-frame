# getCompositePrice

Read-only: what a composite with the current picks will cost, **before** it is added — for a picker's running total.
The host builds the same line `addProductToCart({ variantId, composite })` would (same picks checks, same refusals and
texts) and adds nothing to the cart.

## Parameters

```typescript
interface GetCompositePriceParams {
  variantId: string; // the composite's variant
  composite: CFCompositePick[]; // the picks so far: { itemId, variantId, quantity?, modifiers?, resourceId? }
  compositeSlot?: { startAt: string }; // B41: the date and time bookable picks are for (getCompositeAvailability)
}
```

## Response

```typescript
interface GetCompositePriceResponse {
  success: boolean;
  reason?: string; // picks the host would refuse (e.g. "Side: pick 1"; "Toppings: pick at least 2" when the part allows more)
  total?: number; // ONE composite: line price + picked items' modifiers, minor units; before discounts, fees, tax
  missing: { partId: string; needed: number }[]; // parts still short of their min ("Pick 2 more"); [] = all filled
  timestamp: string;
}
```

Call it again whenever the picks change and show `total`; never add `cost`s or modifier prices yourself. `total`
appears **only once every required pick is made**: until then the host refuses with a `reason` and no `total`, and
`missing` lists what each part still needs — show the reason, "Pick {needed} more" on those parts, and keep Add to
cart disabled until the answer is `success: true`.

## Usage

```typescript
import { renderClient } from '@final-commerce/command-frame';

const quote = await renderClient.getCompositePrice({ variantId, composite: picks });
if (quote.success) setRunningTotal(quote.total);
```
