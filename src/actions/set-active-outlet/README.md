# setActiveOutlet

Loads an outlet by `outletId` and sets it as the active outlet on the POS.

## Parameters

| Field       | Type     | Required |
| :---------- | :------- | :------- |
| `outletId`  | `string` | Yes      |

## Response

Returns `outlet` ([`CFActiveOutlet`](../../types/README.md#cfactiveoutlet)).

## Example

```typescript
await command.setActiveOutlet({ outletId: 'outlet_main' });
```

Throws if the outlet is not found.
