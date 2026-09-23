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
    reason?: string;                    // set when the edit was rejected — the line is unchanged
    internalId?: string;                // the line that was edited
    selections: ModifierSelection[];    // now on the line (new on success, old on rejection)
    rows: ProdModifierBreakdown[];      // the same selections, display-ready
    modifiersTotal: number;             // Σ rows[].amount for this line, minor units
    timestamp: string;
}
```

`selections` is a full replacement, not a merge: send every modifier the line
should keep. `quantity` on a choice is units per line-item unit (1 unless the
modifier is a quantity/stepper type).

`rows` is common's `ProdModifierBreakdown` — names, `label`, `unitPrice` and the
line-extended `amount` (`unitPrice x quantity x line.quantity`, minor units). It
reflects the line **after** the edit on success and **before** it on rejection, so a
picker can repaint straight from the response instead of calling
`getProductModifierSelections` again.

## Failure behaviour

A rule violation, a missing `selections`, an unknown `internalId` and "no product
context" all **resolve** with `success: false` and a `reason`; the line is unchanged
and `rows` / `modifiersTotal` describe the selections still on it. The promise is not
rejected, so no `try`/`catch` is needed for any of them.

The one case that **rejects** the promise is an internal data failure — the line
exists but its variant cannot be read — which is not something a flow can provoke or
recover from. The mock covers every resolving case and matches the host.

## Example Usage

```typescript
// Swap the topping on an existing line
const { selections } = await commandFrame.getProductModifierSelections({ internalId });
const next = selections.map((s) =>
    s.modifierId === toppingsId ? { modifierId: toppingsId, choices: [{ choiceId: avocadoId, quantity: 1 }] } : s
);
const result = await commandFrame.setProductModifierSelections({ internalId, selections: next });
if (!result.success) showError(result.reason);

// Repaint from the response — no second read, no arithmetic
result.rows.forEach((row) => console.log(row.label, `x${row.quantity}`, formatMoney(row.amount)));
console.log('Modifiers', formatMoney(result.modifiersTotal));
```

## Related

- `getProductModifierSelections` — read the line's current selections
- `addProductToCart({ modifiers })` — supply selections when the line is created
- `addProductFee` / `removeProductFee` — the fee-editing actions this mirrors
