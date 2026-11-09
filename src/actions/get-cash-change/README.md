# getCashChange

What a cash tender gives back — computed by the till with the same arithmetic `cashPayment` uses (after the company's
cash rounding), so the number on screen is the number the payment returns. Read-only: nothing is paid.

## Parameters

```typescript
interface GetCashChangeParams {
  tenderedAmount: number; // cash handed over, MINOR units (common parseAmountToMinorUnits)
  amount?: number; // what it is tendered against, MINOR units; default the cart's balance due
}
```

## Response

```typescript
interface GetCashChangeResponse {
  amountDue: number; // before cash rounding
  roundedAmountDue: number; // what cashPayment charges for cash
  cashRounding: number; // roundedAmountDue − amountDue
  tenderedAmount: number;
  change: number; // ≥ 0 — what cashPayment({ tenderedAmount }) returns as change
  remaining: number; // ≥ 0 — how much is still short
  timestamp: string;
}
```

## Example

```typescript
const tendered = parseAmountToMinorUnits(typed, currency);
const { change, remaining } = await command.getCashChange({ tenderedAmount: tendered });
// Show change / remaining; enable "Confirm" when remaining === 0, then cashPayment({ tenderedAmount: tendered }).
```

## Notes

- Call it on each keypad change (debounced); never compute change in the flow.
- The command-frame mock refuses (`Cash change is computed by the till`) — there is no money in the mock.
