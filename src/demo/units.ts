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
