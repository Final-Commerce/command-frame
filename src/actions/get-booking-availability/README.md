# getBookingAvailability

Returns the free windows for a bookable product over a date range: the calendar. **Computed by
the server** out of the merchant's rule set, the outlet's opening hours, the turnaround between
bookings and everything already taken — it is not a stored list you can read from the local
database, and it changes the moment somebody else books.

Ask for the range the user is looking at (a day, a week, a month) and re-ask after any hold or
cancel. Requires a connection; a till with no network can display existing bookings
(`getBookings`) but cannot offer new times.

## Parameters

```typescript
interface GetBookingAvailabilityParams {
  productId: string; // must be a product with productType: 'booking'
  from: string; // ISO 8601
  to: string; // ISO 8601
  resourceId?: string; // "only Marco" — the host narrows the answer; the server returns every resource
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
const { availability } = await renderClient.getBookingAvailability({
  productId: product._id,
  from: startOfDay.toISOString(),
  to: endOfDay.toISOString(),
});

const openSlots = availability.slots.filter((slot) => slot.free > 0 && slot.canStart);
```

## Notes

- **Only offer a slot's own `startAt`.** The grid is anchored to what is free, so slot starts are
  not a fixed "every 30 minutes" — a 15-minute beard trim after a 30-minute haircut shifts the
  whole afternoon. A start time you invent will be refused.
- `free === 0` means taken; `canStart === false` means the window exists but a stay may not begin
  there (arrival days).
- `bufferEndAt` is when the resource is genuinely free again. Do not draw the next slot from `endAt`.
- Re-ask after `holdBooking` or `cancelBooking` rather than mutating the list locally.
