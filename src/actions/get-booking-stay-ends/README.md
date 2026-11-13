# getBookingStayEnds

Where a stay can end, once the customer has picked where it starts: the check-outs a range calendar may offer.
**Computed by the device** from the same rules, grid and holds that `addBookingToCart` checks, so every end it returns
is one the till would accept right now — and nothing past a taken or closed night is ever returned.

**Action label:** a control whose press calls `getBookingStayEnds` carries `data-final-action="get-booking-stay-ends"`.

Date-range rules only (hours, nights, days, whole weeks / months). Call it on the check-in tap; a read, it holds nothing.

## Parameters

```typescript
interface GetBookingStayEndsParams {
  productId: string;
  startAt: string; // the startAt of a slot getBookingAvailability offered — the check-in
  untilDay: string; // 'YYYY-MM-DD' — last day an end may fall on: one page past the shown one, never before the chosen check-out
  resourceId?: string; // omit = any free resource, chosen per end as the hold chooses it
  qty?: number; // places, as you will pass to addBookingToCart; default 1
}
```

## Response

```typescript
interface GetBookingStayEndsResponse {
  success: boolean;
  reason?: string; // no stay from this start: "taken for that window", "at least 2 nights", …
  ends?: CFBookingStayEnd[]; // ascending, never empty on success
  timestamp: string;
}

interface CFBookingStayEnd {
  periods: number; // nights / days / hours — or whole weeks / months
  endAt: string; // send this to addBookingToCart
  lastDayKey: string; // 'YYYY-MM-DD' shop day: check-out day for nights, last day for days
  coveredSlots: { startAt: string; dayKey: string }[]; // every cell the stay takes — what to highlight
}
```

## Example

```typescript
const res = await renderClient.getBookingStayEnds({ productId, startAt: checkIn.startAt, untilDay: lastDayOfNextPage });
if (!res.success) return showReason(res.reason);
// enable a day as check-out only if some end has it as lastDayKey; highlight end.coveredSlots
await renderClient.addBookingToCart({ productId, startAt: checkIn.startAt, endAt: chosen.endAt });
```

## Notes

- **Compute nothing.** Enabled check-outs are the `lastDayKey`s of `ends`; the highlighted nights are the chosen end's
  `coveredSlots`. A flow that counts nights or skips closed days itself owns a second copy of the rules.
- The answer is bounded by `untilDay`, not a year ahead — every end carries its cells. Leave one page more than you
  show, so a check-in on the last day, a whole week or month gets its ends on the first tap; never pass a day before the
  chosen check-out, or paging back drops it. Ask again with a later day when the cashier pages or steps past it.
- The shortest allowed stay comes even when it ends past `untilDay` — alone — so a `minStay` longer than the
  page still books.
- Before adding, say the length (`periods`) — the price is the reservation's `total` once it is in the cart.
- `addBookingToCart` checks the window again: a window taken in between is refused with a reason. Ask again.
- Refused on a storefront and in the mock shop, which has no date-range rules.
