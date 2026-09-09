# getProductModifierSelections

Read-only: returns a cart line's current modifier selections. Modifier
**definitions** flow one-way from station-sync into the till and cannot be
changed from a flow; a line's selections are supplied via
`addProductToCart({ modifiers })` and edited with
`setProductModifierSelections` (full replacement, re-validated).

## Parameters

```typescript
interface GetProductModifierSelectionsParams {
    internalId?: string;   // the cart line to read; defaults to the active product's line
}
```

## Response

```typescript
interface GetProductModifierSelectionsResponse {
    success: boolean;
    reason?: string;                   // set when the read failed (no such line / no active product)
    internalId?: string;               // the line that was read
    selections: ModifierSelection[];   // { modifierId, choices: [{ choiceId, quantity }] }
    timestamp: string;
}
```

`quantity` on a choice is units per line-item unit (1 unless the modifier is a
quantity/stepper type). Selections apply to every unit of the line.

## Example Usage

```typescript
const { selections } = await commandFrame.getProductModifierSelections({ internalId });
// e.g. render a summary of the line's configured choices in a custom flow UI
```

## Related

- `addProductToCart({ modifiers })` — the only flow-facing way selections enter an order.
- `getCurrentCart` — every line exposes `modifierSelections` too; use this action
  when you want one line resolved by the host (active-line defaulting included).
