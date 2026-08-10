# getCashRoundingAmount

Previews the company's cash-rounding setting against an amount — returns the
amount a cash payment would actually charge. Read-only: no cart or order state
changes. When the company has **no** cash-rounding setting, `roundedAmount`
equals `amount` and `cashRounding` is `0`.

Built for flow-owned cash tender UIs: fetch the rounded total, show it to the
cashier, collect the tendered cash, then call
`cashPayment({ amount, tenderedAmount })` — the response's `change` accounts
for the same rounding.

All amounts are **integer MINOR currency units** (e.g. `1575` = $15.75; see
`getContext().minorUnits` for the currency's exponent).

## Parameters

### `GetCashRoundingAmountParams` (optional)

```typescript
interface GetCashRoundingAmountParams {
  /** Amount to round, integer minor units. Defaults to the cart's balance due. */
  amount?: number;
}
```

## Response

### `GetCashRoundingAmountResponse`

```typescript
interface GetCashRoundingAmountResponse {
  success: boolean;
  amount: number;        // the input amount (minor units)
  roundedAmount: number; // after cash rounding (minor units)
  cashRounding: number;  // signed delta: roundedAmount - amount
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Preview the rounded total for the current cart:
const { roundedAmount, cashRounding } = await command.getCashRoundingAmount();

// ...display roundedAmount, collect cash from the customer...

const result = await command.cashPayment({
  amount: roundedAmount,     // or the original balance — the POS rounds again
  tenderedAmount: 2000,      // $20.00 handed over
});
console.log(`Change due (minor units): ${result.change}`);
```

## Notes

- The rounding increment comes from the company's `cash_rounding` setting
  (e.g. `"0.05"`); currencies without decimals (e.g. JPY) are handled.
- `cashPayment` applies the same rounding when charging, so the change it
  returns is consistent with this preview.
