# setProductModifierSelections

Replace a cart line's modifier selections — the editing counterpart of
`getProductModifierSelections`, shaped like the product-fee editing actions.
The new selections are validated against the product's category-modifier rules
exactly as `addProductToCart({ modifiers })` validates them (min/max units,
required modifiers, outlet availability); a selection that breaks a rule
rejects the edit with a `reason` and the line is left unchanged. On success the
line's priced modifier rows are rebuilt from the current modifier library
snapshot and the line is repriced.

## Parameters

```typescript
interface SetProductModifierSelectionsParams {
    internalId?: string;               // the cart line to edit; defaults to the active product's line
    selections: ModifierSelection[];   // the line's COMPLETE new answers — replaces all; [] clears
}
```

## Response

```typescript
interface SetProductModifierSelectionsResponse {
    success: boolean;
    reason?: string;                   // set when the edit was rejected — the line is unchanged
    internalId?: string;               // the line that was edited
    selections: ModifierSelection[];   // now on the line (new on success, old on rejection)
    timestamp: string;
}
```

`selections` is a full replacement, not a merge: send every modifier the line
should keep. `quantity` on a choice is units per line-item unit (1 unless the
modifier is a quantity/stepper type).

## Example Usage

```typescript
// Swap the topping on an existing line
const { selections } = await commandFrame.getProductModifierSelections({ internalId });
const next = selections.map((s) =>
    s.modifierId === toppingsId ? { modifierId: toppingsId, choices: [{ choiceId: avocadoId, quantity: 1 }] } : s
);
const result = await commandFrame.setProductModifierSelections({ internalId, selections: next });
if (!result.success) showError(result.reason);
```

## Related

- `getProductModifierSelections` — read the line's current selections
- `addProductToCart({ modifiers })` — supply selections when the line is created
- `addProductFee` / `removeProductFee` — the fee-editing actions this mirrors
