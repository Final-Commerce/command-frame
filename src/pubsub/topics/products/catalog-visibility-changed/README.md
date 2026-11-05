# catalog-visibility-changed

Published on the `products` topic when a product is hidden or shown at an outlet (a `catalog-visibility` row syncs).
`getProducts` leaves hidden products out, and a composite offers only the items sold at the till's outlet — a menu
may become Unavailable, or a drink may disappear from it. Debounce, then call `getProducts` again.

```typescript
interface CatalogVisibilityChangedPayload {
  visibility: { _id: string; productId: string; outletId: string; isDeleted?: boolean };
}
```
