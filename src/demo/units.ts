/**
 * FI-6991 money contract, mirrored for the mock host.
 *
 * The POS engine a published build boots (kaching) takes every FIXED money
 * amount as an INTEGER in MINOR currency units and stores it DIRECTLY, throwing
 * on a fraction; a percent arrives raw 0-100 and is stored as a FRACTION
 * (10 -> 0.1). See kaching's `src/command-frame/utils/adjustmentValue.ts`.
 *
 * The mocks used to convert fixed amounts from MAJOR units — the pre-FI-6991
 * contract — so an app that was correct against a real register read 100x wrong
 * in preview, and an app tuned until preview looked right shipped 100x wrong.
 * A mock host is only worth having if it stores, and rejects, exactly what the
 * engine does.
 */

/** A fixed money amount must be an integer count of minor units. */
export function requireMinorUnitsInteger(amount: number | string, what: string): number {
  const n = Number(amount);
  if (!Number.isFinite(n)) {
    throw new Error(`${what} must be a valid number`);
  }
  if (!Number.isInteger(n)) {
    throw new Error(`${what} must be an integer amount in minor currency units (e.g. 1575 = $15.75)`);
  }
  return n;
}

/** A percent arrives raw 0-100 on the wire and is STORED as a fraction. */
export function percentToFraction(amount: number): number {
  return Number(amount) / 100;
}

/** kaching adjustmentValue.ts:25-38 — non-numeric, negative/zero and (for a percent) >100% discounts are refused. */
export function assertValidDiscount(amount: number, isPercent: boolean): number {
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error('Discount amount must be a valid number');
  if (isPercent && (n <= 0 || n > 100)) throw new Error('Discount percentage must be between 0 and 100');
  if (!isPercent && n <= 0) throw new Error('Discount amount must be greater than 0');
  return n;
}

/** kaching adjustmentValue.ts:56-59 — the stored value: a fraction for a percent, minor units for a fixed amount. */
export function resolveDiscountValue(amount: number, isPercent: boolean): number {
  const n = assertValidDiscount(amount, isPercent);
  return isPercent ? n / 100 : requireMinorUnitsInteger(n, 'Discount amount');
}
