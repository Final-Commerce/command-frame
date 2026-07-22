// Get Cash Rounding Amount Types

export interface GetCashRoundingAmountParams {
    /**
     * The amount to round, in integer MINOR currency units (e.g. 1577 =
     * $15.77). Defaults to the cart's current balance due when omitted.
     */
    amount?: number;
}

export interface GetCashRoundingAmountResponse {
    success: boolean;
    /** The input amount that was rounded, in integer MINOR currency units. */
    amount: number;
    /**
     * The amount after applying the company's cash-rounding setting, in
     * integer MINOR currency units. Equals `amount` when no cash-rounding
     * setting is configured.
     */
    roundedAmount: number;
    /**
     * Signed rounding delta (`roundedAmount - amount`) in integer MINOR
     * currency units. Positive = rounded up. 0 when no setting is configured.
     */
    cashRounding: number;
    timestamp: string;
}

export type GetCashRoundingAmount = (
    params?: GetCashRoundingAmountParams
) => Promise<GetCashRoundingAmountResponse>;
