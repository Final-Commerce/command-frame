# addNonRevenueItem

Adds a non-revenue line to the host cart (for example gift-card load / liability). The host generates a unique line id; your extension supplies a reference `id` (stored in cart metadata as `refId`).

## Parameters

`AddNonRevenueItemParams`

| Field | Type | Required | Description |
| :---- | :--- | :------- | :---------- |
| `id` | `string` | Yes | Extension reference (e.g. product key). Trimmed and copied into line `metadata.refId`; must be non-empty (whitespace-only is rejected). |
| `amount` | `number` | Yes | Amount in integer minor currency units (e.g. `1575` = $15.75), same convention as cart totals. |
| `label` | `string` | No | Short label for receipts/UI. |
| `metadata` | `Record<string, unknown>` | No | Extra fields (`customTableId`, `cardCode`, etc.). |
| `applyTaxes` | `boolean` | No | When true, line may be taxed (requires `taxTableId` when taxing is implemented). Default false. |
| `taxTableId` | `string` | No | Tax table when `applyTaxes` is used. |

## Response

`Promise<AddNonRevenueItemResponse>`

| Field | Type | Description |
| :---- | :--- | :---------- |
| `success` | `true` | |
| `externalId` | `string` | Unique cart line id from the host (matches `cart.nonRevenueItems[].externalId` from [`getCurrentCart`](../get-current-cart/README.md)). |
| `refId` | `string` | Trimmed copy of the request `id`. |
| `amount` | `number` | Amount in minor units as stored on the line — same integer value as the request `amount` (no conversion applied). |
| `label` | `string` | Optional. |
| `metadata` | `Record<string, unknown>` | Optional; includes `refId`. |
| `applyTaxes` | `boolean` | Optional. |
| `taxTableId` | `string` | Optional. |
| `timestamp` | `string` | ISO time of the action. |

## Example

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.addNonRevenueItem({
  id: 'gift-card-sku-1',
  amount: 2500, // $25.00 in minor units
  label: 'Gift card load',
});
console.log('Line id:', result.externalId);
```

## Errors

- `"id is required for addNonRevenueItem"` — missing, or empty/whitespace-only, `id`.
- `"amount must be a positive number"` — `amount` is not finite or is `<= 0`.
- `"amount must be an integer in minor currency units (e.g. 1575 = $15.75)"` — `amount` is not an integer.

## Notes

- **Breaking change (0.2.0):** `AddNonRevenueItemResponse.id` was renamed to `externalId`. [`CFNonRevenueItem`](../../types/README.md#cfnonrevenueitem) cart lines use `externalId` as well.
