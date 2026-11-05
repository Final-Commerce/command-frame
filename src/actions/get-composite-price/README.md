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
  quantity?: number; // how many composites, as addProductToCart takes it; default 1
}
```

## Response

```typescript
interface GetCompositePriceResponse {
  success: boolean;
  reason?: string; // picks the host would refuse (e.g. "Side: pick 1"; "Toppings: pick at least 2" when the part allows more)
  total?: number; // `quantity` composites = unitTotal × quantity, minor units; before discounts, fees, tax
  unitTotal?: number; // ONE composite: line price + picked items' modifiers, minor units
  missing: { partId: string; name: string | null; needed: number }[]; // parts still short of their min; [] = all filled
  fullPartIds: string[]; // parts whose picks already reach their max — disable "+" on them
  timestamp: string;
}
```

Call it again whenever the picks change and show `total`; never add `cost`s or modifier prices yourself. `total`
appears **only once every required pick is made**: until then the host refuses with a `reason` and no `total`, and
`missing` lists what each part still needs — show the reason, "Pick {needed} more {name}" on those parts, and keep Add
to cart disabled until the answer is `success: true`. Disable "+" on the parts in `fullPartIds`; never count picks
against `max` yourself. Pass the stepper's `quantity` and show `total` — do not multiply `unitTotal`.

## Usage

```typescript
import { renderClient } from '@final-commerce/command-frame';

const quote = await renderClient.getCompositePrice({ variantId, composite: picks });
if (quote.success) setRunningTotal(quote.total);
```
