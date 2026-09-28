# getBookingAvailability

Returns the free windows for a bookable product over a date range: the calendar. **Computed by
the device** out of the merchant's rule set, the outlet's opening hours, the turnaround between
bookings and everything already taken — it is not a stored list you can read from the local
database, and it changes the moment somebody else books.

Ask for the range the user is looking at (a day, a week, a month) and re-ask after any hold or
cancel. No connection needed — the rules and the holds are synced down, and the grid is
computed from them locally. A till with no network can display existing bookings
(`getBookings`) but cannot offer new times.

## Parameters

```typescript
interface GetBookingAvailabilityParams {
  productId: string; // must be a product with productType: 'booking'
  fromDay?: string; // 'YYYY-MM-DD' — the SHOP's day. Prefer this.
  days?: number; // how many shop days from fromDay (default 1)
  from?: string; // ISO 8601 — the instant form, when you genuinely have instants
  to?: string; // ISO 8601
  resourceId?: string; // "only Marco" — narrows the answer; omit it and every resource is returned
  outletId?: string;
}
```

## Response

```typescript
interface GetBookingAvailabilityResponse {
  availability: CFBookingAvailability;
  timestamp: string;
}

interface CFBookingAvailability {
  productId: string;
  bookingRulesId: string;
  bookingType: BookingType; // rental | appointment | overnight | group
  ratePeriod: BookingRatePeriod; // slot | day | night | week | month
  minimumToRun?: number; // label only — a group slot below this MAY be cancelled
  minStay?: number;
  maxStay?: number;
  /** Last instant this product can be booked into; absent when nothing bounds it. */
  bookableUntil?: string;
  /** The range you asked for starts past `bookableUntil`. Say "bookings open only up to …"
   *  instead of "nothing free" — an empty grid otherwise reads as fully booked. Decided here,
   *  not in the UI: comparing a day against the window is a rule. */
  beyondWindow?: boolean;
  slots: CFBookingSlot[];
}

interface CFBookingSlot {
  startAt: string;
  endAt: string;
  bufferEndAt: string; // end of the turnaround; equals endAt when there is none
  canStart: boolean; // period rules with arrival days: may a stay START here
  capacity: number; // seats across every serving resource
  booked: number;
  free: number;
  resources: { resourceId: string; name: string; capacity: number; booked: number; free: number }[];
}
```

## Example

```typescript
// A fortnight of the shop's own days, for a day picker.
const { availability } = await renderClient.getBookingAvailability({
  productId: product._id,
  fromDay: '2026-09-25',
  days: 14,
});

availability.days; // ['2026-09-25', '2026-09-26', …] — the chips
const monday = availability.slots.filter((slot) => slot.dayKey === '2026-09-29');
const openSlots = monday.filter((slot) => slot.free > 0 && slot.canStart);

// Printing a time: use the clock the answer names, never the machine's.
new Intl.DateTimeFormat([], {
  timeZone: availability.timeZone ?? undefined,
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(openSlots[0].startAt));
```

## Notes

- **Only offer a slot's own `startAt`.** The grid is anchored to what is free, so slot starts are
  not a fixed "every 30 minutes" — a 15-minute beard trim after a 30-minute haircut shifts the
  whole afternoon. A start time you invent will be refused.
- `free === 0` means taken; `canStart === false` means the window exists but a stay may not begin
  there (arrival days).
- `bufferEndAt` is when the resource is genuinely free again. Do not draw the next slot from `endAt`.
- **Do not work out which day a slot is on.** `slot.dayKey` says it, stamped in the zone the grid
  was built in. The same instant is Monday in Vancouver and Tuesday in Auckland, so a client that
  derives the day owns a copy of a rule — that copy is how a salon's 9am came out at 1:30pm on a
  till in another province, with the calendar and the order screen wrong in the same direction so
  they agreed with each other.
- **Do not turn a day into instants yourself.** `fromDay` + `days` is resolved local-midnight to
  local-midnight in the shop's zone, so a 23- or 25-hour day is still one day. Asking a wide
  instant range and filtering afterwards is the workaround this replaces.
- `availability.timeZone` is the clock to print on — the outlet's, else the company's, `null` when
  the business configured none. Format with it; never reach for the machine's zone.
- Re-ask after `holdBooking` or `cancelBooking` rather than mutating the list locally.
