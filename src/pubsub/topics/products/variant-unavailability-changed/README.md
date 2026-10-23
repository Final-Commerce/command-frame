# variant-unavailability-changed

Published on the `products` topic when a variant is marked sold out at an outlet or the mark is removed (a
`variant-unavailability` row syncs, e.g. after `setVariantUnavailable`). `getProducts` reports the mark as
`variant.unavailable`, and a composite refuses a marked item (`'marked_sold_out'`). Debounce, then call `getProducts` again.

```typescript
interface VariantUnavailabilityChangedPayload {
  unavailability: { _id: string; productId: string; variantId: string; outletId: string; isDeleted?: boolean };
}
```
