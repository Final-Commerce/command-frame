# composite-changed

Published on the `products` topic when a part or item of a composite product syncs (FT-83). One save in the back
office replaces all of a composite's parts and items, so it fires once per row: debounce, then call `getProducts`
again — `product.composite` is rebuilt by the host. Do not patch it from the payload.

```typescript
interface CompositeChangedPayload {
  compositeRow: { _id: string; compositeProductId: string; isDeleted?: boolean };
}
```
