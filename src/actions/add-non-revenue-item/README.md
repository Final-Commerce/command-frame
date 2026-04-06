# addNonRevenueItem

Adds a non-revenue line to the host cart (for example gift-card load / liability). The host generates a unique line id; your extension supplies a reference `id` (stored in cart metadata as `refId`).

## Parameters

`AddNonRevenueItemParams`

| Field | Type | Required | Description |
| :---- | :--- | :------- | :---------- |
| `id` | `string` | Yes | Extension reference (e.g. product key). Copied into line `metadata.refId`. |
| `amount` | `number` | Yes | Amount in major currency units (e.g. dollars), same convention as cart totals. |
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
| `refId` | `string` | Same as request `id`. |
| `amount` | `number` | Amount in minor units as stored on the line (host currency precision). |
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
  amount: 25,
  label: 'Gift card load',
});
console.log('Line id:', result.externalId);
```

## Notes

- **Breaking change (0.2.0):** `AddNonRevenueItemResponse.id` was renamed to `externalId`. [`CFNonRevenueItem`](../../types/README.md#cfnonrevenueitem) cart lines use `externalId` as well.
