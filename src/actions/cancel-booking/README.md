# cancelBooking

Releases a booking — a hold the customer walked away from, or a confirmed appointment the shop
is cancelling. The window becomes free for everybody immediately, and the cancellation is
recorded on the booking's history.

Requires a connection, like every write to occupancy. The order, if there is one, is **not**
touched: cancelling a booking is not a refund.

## Parameters

```typescript
interface CancelBookingParams {
  bookingId: string; // `id` from holdBooking or getBookings
}
```

## Response

```typescript
interface CancelBookingResponse {
  booking: CFBooking; // status: 'cancelled'
  timestamp: string;
}
```

## Example

```typescript
await renderClient.cancelBooking({ bookingId: booking.id });
```

## Notes

- Money is separate. If the customer paid, issue a refund through the refund actions as well.
- Do not cancel a hold you are about to replace with another one for the same customer — hold the
  new window FIRST, so a refused hold does not leave them with nothing.
- Re-ask availability afterwards: the freed window changes the grid for everyone.
