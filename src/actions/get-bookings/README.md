# getBookings

Lists the bookings themselves — what is on the books. Read from the host's local database, so
it works offline and is the right call for a day view, a resource's schedule, or a customer's
appointments.

A booking IS the occupancy: a held or confirmed booking is the only record that a window is
taken, so this is also how you show "10:00 — Alex Green, with Marco".

## Parameters

```typescript
interface GetBookingsParams {
  resourceId?: string; // everything taking this resource's time
  productId?: string;
  customerId?: string; // this customer's appointments
  from?: string; // bookings whose window OVERLAPS this range (ISO 8601)
  to?: string;
  includeExpired?: boolean; // default false: live only (confirmed + unexpired holds)
}
```

## Response

```typescript
interface GetBookingsResponse {
  bookings: CFBooking[];
  timestamp: string;
}

interface CFBooking {
  id: string;
  productId: string;
  resourceId: string;
  variantId?: string;
  startAt: string;
  endAt: string;
  bufferEndAt: string;
  status: ReservationStatus; // held | confirmed | cancelled | expired
  expiresAt?: string; // holds only
  orderId?: string;
  customerId?: string;
  productName?: string; // frozen when booked — a later rename cannot rewrite history
  resourceName?: string;
  customerName?: string;
}
```

## Example

```typescript
const { bookings } = await renderClient.getBookings({
  resourceId: 'res_marco',
  from: startOfDay.toISOString(),
  to: endOfDay.toISOString(),
});
```

## Notes

- Names on the booking are **snapshots**. Show them as they are; do not "fix" them from the
  current product or customer record.
- A `held` booking with `expiresAt` in the past occupies nothing, even though the row is still
  there. Leave it to `includeExpired` rather than filtering by status alone.
- This is a read of local data: it never proves a window is free. Only `holdBooking` does.
