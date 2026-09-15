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
    reason?: string;                    // set when the read failed (no such line / no active product)
    internalId?: string;                // the line that was read
    selections: ModifierSelection[];    // raw: { modifierId, choices: [{ choiceId, quantity }] }
    rows: ProdModifierBreakdown[];      // display-ready, one row per chosen choice
    modifiersTotal: number;             // Σ rows[].amount for this line, minor units
    timestamp: string;
}
```

`quantity` on a choice is units per line-item unit (1 unless the modifier is a
quantity/stepper type). Selections apply to every unit of the line.

### `selections` vs `rows`

Two views of the same answer, and which one you want depends on what you are doing:

- **`selections`** is the round-trip shape — ids and counts only. Pass it straight
  back into `setProductModifierSelections({ selections })` or
  `addProductToCart({ modifiers })`. It carries no names and no money.
- **`rows`** is the render shape — common's `ProdModifierBreakdown`, the same type the
  POS tax engine produces. Every row already carries `modifierName`, `choiceName`,
  `label` ("Toppings - Avocado"), `unitPrice` and `amount`, where **`amount` is the
  line-extended money**: `unitPrice x quantity x line.quantity`, in minor units.

A flow never has to hold the `getProducts` response, index `modifiers[].choices[]` by
id to recover a name or a price, or multiply anything to draw a modifier row.

## Failure behaviour

Every failure of this action **resolves** with `success: false` and a `reason` — the
promise is not rejected, so no `try`/`catch` is needed. `selections` and `rows` come
back empty and `modifiersTotal` is `0`.

`setProductModifierSelections` behaves the same way, with one exception documented in
its own README. The mock matches the host in both cases.

## Example Usage

```typescript
const { rows, modifiersTotal } = await commandFrame.getProductModifierSelections({ internalId });

rows.forEach((row) => {
    // "Toppings - Avocado  x2   $10.00"  — nothing to look up, nothing to multiply
    console.log(row.label, `x${row.quantity}`, formatMoney(row.amount));
});
console.log('Modifiers', formatMoney(modifiersTotal));
```

To edit, send `selections` back rather than `rows`:

```typescript
const { selections } = await commandFrame.getProductModifierSelections({ internalId });
await commandFrame.setProductModifierSelections({
    internalId,
    selections: selections.filter((s) => s.modifierId !== droppedModifierId)
});
```

## Related

- `addProductToCart({ modifiers })` — the only flow-facing way selections enter an order.
- `getCurrentCart` — every line exposes `modifierSelections` (raw) and `modifiers`
  (priced per-unit rows, **no** line-extended `amount`) too; use this action when you
  want one line resolved and extended by the host (active-line defaulting included).
- `ProdModifierBreakdown` is re-exported as `CFProdModifierBreakdown`; it is common's
  type, not a command-frame invention.
