# setProductOutlets

Declaratively reconciles a product's catalog-visibility (CV) so it's available at exactly the given outlets — parity with deerlake's `setAvailableOutletsForProduct` + `applyHideShowInTxn` (spec §3.3.4).

> **Render-side command.** Handled by kaching's command-frame handler.

## Parameters

### `SetProductOutletsParams`

```typescript
interface SetProductOutletsParams {
  productId: string;
  availableOutletIds: string[];
}
```

| Param                | Type       | Required | Notes                                                                                                                                                                                                   |
| -------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`          | `string`   | yes      | The product to reconcile.                                                                                                                                                                               |
| `availableOutletIds` | `string[]` | yes      | The **complete** set of outlets the product should be visible at, used as-given (not intersected with anything already set) — pass every outlet that should remain visible, not just the ones changing. |

### CV semantics (spec §6.4)

- **Presence of a live catalog-visibility doc = HIDDEN; absence = visible.** There's no separate "visible" doc — visibility is the _default_ state.
- `hidden = activeOutletIds − availableOutletIds` (the company's active outlets minus what was passed in).
- **Hiding** an outlet upserts a product-level CV exception for it (`variantId: null` — this is a product-wide hide, not per-variant) and soft-deletes the product's inventory rows at that outlet. Re-hiding an outlet that was previously hidden and shown again simply resurrects (un-soft-deletes) the same exception doc rather than creating a new one.
- **Showing** an outlet soft-deletes its CV exception (if any), restores that outlet's inventory rows (`quantity`/`manageStock` are preserved from before the hide — showing doesn't reset stock), and **seeds any missing rows** for every live variant at that outlet (`manageStock: false, quantity: 0`) — covers outlets the product never had inventory rows for in the first place.
- Never a hard delete — hide/show only ever flips `isDeleted` on the CV/inventory docs.

## Response

### `SetProductOutletsResponse`

```typescript
interface SetProductOutletsResponse {
  success: boolean;
  hiddenOutletIds: string[];
  shownOutletIds: string[];
  timestamp: string;
}
```

`hiddenOutletIds` / `shownOutletIds` partition the company's active outlets after the reconcile — every active outlet id appears in exactly one of the two lists. Cross-check `hiddenOutletIds` against `getProductVisibility`'s output if you need to re-read the state later.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Visible only at two outlets — every other active outlet gets hidden
const result = await command.setProductOutlets({
  productId: '64abc123def456',
  availableOutletIds: ['outlet_airport_1', 'outlet_airport_2'],
});
console.log(result.hiddenOutletIds); // every other active outlet
console.log(result.shownOutletIds); // ['outlet_airport_1', 'outlet_airport_2']

// Visible everywhere again — pass every active outlet id
await command.setProductOutlets({
  productId: '64abc123def456',
  availableOutletIds: allActiveOutletIds,
});
```
