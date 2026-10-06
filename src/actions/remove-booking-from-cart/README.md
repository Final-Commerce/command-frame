# removeBookingFromCart

Takes a booked service out of the cart and releases the window it was holding.

```ts
const { reservationInternalId } = await renderClient.removeBookingFromCart({
  reservationInternalId: 'a3f1…',
});
```

## Why one command, not two

The mirror of [`addBookingToCart`](../add-booking-to-cart/README.md), for the same reason: a
reservation stands on a hold. Dropping the cart row without releasing that hold leaves
the window occupied for everyone else with nobody able to see whose it is — and the customer who
just changed their mind cannot rebook the slot they released a second ago.

## Params

| Field                   | Type     | Notes                                                        |
| ----------------------- | -------- | ------------------------------------------------------------ |
| `reservationInternalId` | `string` | The reservation's own id, as `addBookingToCart` returned it. |

## Response

| Field                   | Type         | Notes                                                                                |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `reservationInternalId` | `string`     | Echoed back.                                                                         |
| `booking`               | `CFBooking?` | The released hold. Absent when the host no longer knows which hold the row stood on. |
| `timestamp`             | `string`     | ISO 8601.                                                                            |

## Errors

- No active company — nothing to sell against.
- `reservationInternalId` not in the cart.
- Offline: releasing a window works with no connection, like taking one — the row is written locally and syncs up.
