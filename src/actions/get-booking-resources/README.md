# getBookingResources

Lists the bookable resources — the people, rooms, tables or machines whose time a bookable
product is sold as. Read from the host's local database, so it works offline and answers
instantly.

Pass `productId` to get only the resources that actually perform that service: a salon's
"Beard trim" may be done by two of its four staff, and offering the other two produces a
booking the shop cannot honour.

## Parameters

```typescript
interface GetBookingResourcesParams {
  productId?: string; // only resources that serve this bookable product
  outletId?: string; // only resources standing at this outlet
}
```

A resource with no `outletId` serves every outlet.

## Response

```typescript
interface GetBookingResourcesResponse {
  resources: CFBookingResource[];
  timestamp: string;
}

interface CFBookingResource {
  id: string;
  name: string; // "Marco", "Room 4", "Scooter 1"
  kind: BookingResourceKind; // staff | room | property | space | asset | table
  tag?: string; // QR, room number, plate — what a merchant scans or reads out
  outletId?: string;
  timeZone?: string;
}
```

## Example

```typescript
const { resources } = await renderClient.getBookingResources({ productId: product._id });
// → [{ id: 'res_marco', name: 'Marco', kind: 'staff' }, …]
```

## Notes

- `kind` is a label, not a rule: treat it as an icon/wording hint, never as permission.
- Do not cache the list across outlets — a resource can be outlet-specific.
