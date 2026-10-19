# getCompositeAvailability

Read-only (FT-83, B41): the start times at which **every** bookable item a composite's picks name can be held — one date
and time picker for the whole composite. When `composite.needsDate` is true you MUST show that picker: `addProductToCart`
and `getCompositePrice` refuse such a composite without `compositeSlot`. Pass `compositeSlot` to `getCompositePrice` once a
time is picked; before that show the composite's price without calling it. Ask again whenever the picks change.

The host reads each bookable's slots from its own booking rows and keeps the starts where each one has the seats its
picks need (the item's `quantity` × the pick's `quantity`): the seats of one resource, otherwise of several resources
together. A pick naming a `resourceId` counts that resource only.

## Parameters

```typescript
interface GetCompositeAvailabilityParams {
  variantId: string; // the composite's variant
  composite?: CFCompositePick[]; // the picks so far; absent = each part's defaultPick
  fromDay?: string; // first shop day, YYYY-MM-DD; default today
  days?: number; // default 1
}
```

## Response

```typescript
interface GetCompositeAvailabilityResponse {
  success: boolean;
  reason?: string; // not a composite, nothing bookable picked, no booking rules on this till yet
  slots: { startAt: string; dayKey: string }[]; // in time order; [] = nothing free for all of them
  timeZone: string | null;
  timestamp: string;
}
```

Send the chosen `startAt` back as `addProductToCart({ variantId, composite, compositeSlot: { startAt } })` (and
`getCompositePrice` with the same `compositeSlot`). The add holds every bookable in one step; if a seat went in the
meantime it is refused with a `reason` and nothing is held — ask again.

Until a time is chosen, bookable items read `unavailable: 'by_date'` and do not make the composite unavailable; in the
chosen window an item without enough seats reads `'fully_booked'`.

## Usage

```typescript
import { renderClient } from '@final-commerce/command-frame';

if (product.composite?.needsDate) {
  const { slots } = await renderClient.getCompositeAvailability({ variantId, composite: picks, fromDay: '2026-10-02' });
  showTimes(slots);
}
```
