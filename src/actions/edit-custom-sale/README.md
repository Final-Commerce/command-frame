# editCustomSale

Edits an existing custom sale line in the cart of the parent window. Look up the line by the `customSaleId` returned from [`addCustomSale`](../add-custom-sale/README.md); only the fields you pass are changed.

## Parameters

### `EditCustomSaleParams`

```typescript
interface EditCustomSaleParams {
  customSaleId: string; // Required — id returned by addCustomSale
  label?: string; // Optional — new display label
  price?: number | string; // Optional — integer MINOR currency units (1575 = $15.75)
  quantity?: number; // Optional — positive integer
  applyTaxes?: boolean; // Optional
  taxTableId?: string; // Optional — tax table to use when applyTaxes is true
}
```

#### `customSaleId` (required)

The id of the custom sale line to edit — the `customSaleId` field of the `addCustomSale` response. Editing an id that is not in the cart fails.

#### `label`, `price`, `quantity`, `applyTaxes`, `taxTableId` (optional)

Each field is applied only when present, so a partial edit (e.g. quantity only) leaves the other fields untouched. `price` follows the money contract: an integer in minor currency units. `quantity` must be a positive integer. `taxTableId` selects the tax table when the line is taxed; when omitted the line keeps its current table. Passing either `applyTaxes` or `taxTableId` re-resolves the line's tax table: an unrecognized `taxTableId` does not throw — it falls back to the line's current table, then to the organization's standard tax table. If no tax table can be resolved, the line is not taxed even when `applyTaxes: true` is requested.

## Response

### `EditCustomSaleResponse`

```typescript
interface EditCustomSaleResponse {
  success: boolean;
  customSaleId: string;
  label: string; // the line's label after the edit
  price: number; // minor units, after the edit
  quantity: number; // after the edit
  applyTaxes: boolean;
  timestamp: string;
}
```

## Example

```typescript
const sale = await command.addCustomSale({ label: 'Setup fee', price: 2500, applyTaxes: true });

// Customer wants three of them:
await command.editCustomSale({ customSaleId: sale.customSaleId, quantity: 3 });
```

## Errors

- `"Parameters are required for editCustomSale"` — called without params
- `"customSaleId is required"` — missing id
- `"Custom sale not found"` — the id is not a custom sale line in the current cart
- `"Price must be greater than 0"` — `price` is zero, negative, or not a finite number
- `"price must be an integer amount in minor currency units (e.g. 1575 = $15.75)"` — fractional price
- `"quantity must be a positive integer"` — zero, negative, or fractional quantity

## Notes

- The edit is published internally as a `product-updated` event on the `cart` channel (there is currently no dedicated custom-sale cart event).
