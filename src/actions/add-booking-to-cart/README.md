# addBookingToCart

Sells a service: claims the window on the server and puts it in the cart as a **reservation**.

A bookable product does not become a line item. `lineItems[]` stays the goods array; services live
in `reservations[]` with their own money, so a booking order can be reported and changed without
touching the goods path. The totals, tax and payment work exactly as they do for anything else —
the reservation is priced through the same engine.

This one call replaces "hold, then add to cart": doing it in two steps leaves a window claimed for
a cart that never got the line. Use `holdBooking` only when you deliberately want a claim with no
sale behind it.

## Parameters

```typescript
interface AddBookingToCartParams {
  productId: string;
  resourceId: string;
  startAt: string; // MUST be a slot start getBookingAvailability offered
  endAt: string; // that slot's endAt (or the last slot's, for a stay)
  variantId?: string; // defaults to the product's only variant
  customerId?: string;
}
```

## Response

```typescript
interface AddBookingToCartResponse {
  booking: CFBooking; // status 'held'; expiresAt is how long the window is yours
  reservationInternalId: string; // the reservation's id in the cart and on the order
  timestamp: string;
}
```

## Example

```typescript
const { booking } = await renderClient.addBookingToCart({
  productId: product._id,
  resourceId: slot.resources[0].resourceId,
  startAt: slot.startAt,
  endAt: slot.endAt,
});
// The service is now in the cart. Take payment as usual; the host confirms the booking when the
// order is paid, and the reservation on the order carries the time, the resource and the money.
```

## Notes

- **Handle the refusal.** Two people booking the same window at once is normal, not exceptional:
  re-ask `getBookingAvailability` and let the customer pick again.
- The booking stays `held` until the order is paid. An abandoned cart releases the window on its
  own when `expiresAt` passes — nothing to clean up.
- There is no `confirmBooking` to call: only the host can know the sale completed.
