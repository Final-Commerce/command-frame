# holdBooking

Claims a window for one customer. **This is the only way to find out whether a slot is really
free** — availability is a snapshot that can be a second out of date, and two customers looking
at the same screen will both see the same free slot.

The server makes the claim atomically: exactly one of two simultaneous requests for the same
window succeeds, the other is refused. Requires a connection; a hold cannot be made offline,
because the guarantee lives on the server.

The hold expires on its own (the merchant sets how long in the rule set — 10 minutes by
default), which is what stops an abandoned checkout from taking a resource off the market.

## Parameters

```typescript
interface HoldBookingParams {
  productId: string;
  resourceId: string;
  startAt: string; // MUST be the startAt of a slot getBookingAvailability offered
  endAt: string; // the slot's own endAt (or the last slot's, for a stay)
  variantId?: string;
  customerId?: string;
}
```

## Response

```typescript
interface HoldBookingResponse {
  booking: CFBooking; // id is what you put in the cart, confirm or cancel; expiresAt is your clock
  timestamp: string;
}
```

## Example

```typescript
const { booking } = await renderClient.holdBooking({
  productId: product._id,
  resourceId: slot.resources[0].resourceId,
  startAt: slot.startAt,
  endAt: slot.endAt,
});

await renderClient.addProductToCart({
  variantId: product.variants[0]._id,
  booking: { bookingId: booking.id },
});
```

## Notes

- **Handle the refusal.** A rejected hold is the normal outcome of two people booking at once, not
  an exceptional error: re-ask availability and let the customer pick again.
- Pass `booking.bookingId` to `addProductToCart`, or the customer pays for a service with no time
  attached and the window silently expires.
- Do not invent `startAt`. See the anchoring note in `getBookingAvailability`.
- There is no `confirmBooking` for a flow to call: the host confirms the booking when the order is
  paid, because only the host can know that it was.
