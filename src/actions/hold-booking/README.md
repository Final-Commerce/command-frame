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

```

To SELL that window, use [`addBookingToCart`](../add-booking-to-cart/README.md) instead of this
action: it claims the window and puts the service in the cart in ONE call. `addProductToCart` has
no `booking` parameter — holding and adding as two steps leaves a claimed window behind whenever
the second step fails, and that window is invisible to the person who lost it.

## Notes

- **Handle the refusal.** A rejected hold is the normal outcome of two people booking at once, not
  an exceptional error: re-ask availability and let the customer pick again.
- A hold on its own is NOT a sale. Nothing in the cart points at it, so it expires on its own —
  reach for `addBookingToCart` unless you specifically want a window held outside a cart.
- Do not invent `startAt`. See the anchoring note in `getBookingAvailability`.
- There is no `confirmBooking` for a flow to call: the host confirms the booking when the order is
  paid, because only the host can know that it was.
