# inventory-changed

Published on the `products` topic when a variant's stock at an outlet syncs (an `inventory` row). A composite is Sold
out or Unavailable by its components' shelves (B35) — debounce, then call `getProducts` again.

```typescript
interface InventoryChangedPayload {
  inventory: { _id: string; variantId: string; outletId: string; quantity?: number | null; manageStock?: boolean };
}
```
