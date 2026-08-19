import { CFOrder } from "../../CommonTypes";

// Tap to Pay Payment Types
export interface TapToPayPaymentParams {
    /**
     * The amount to pay with this tender, in integer MINOR currency units
     * (e.g. 1575 = $15.75). Required whenever the balance due is greater than
     * $0; may be omitted only on a cart that already nets to a $0 balance due
     * (e.g. fully discounted), where it defaults to 0. Semantics against the
     * cart's balance due:
     *   - missing            → error, unless the balance due is $0 (→ 0)
     *   - less than balance  → partial payment (the POS enters a fixed
     *                          split-payment leg for this amount)
     *   - equal to balance   → full payment
     *   - more than balance  → error
     */
    amount?: number;
    /** Override the fulfillment state after full payment. kaching resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface TapToPayPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Change due back to the customer in integer MINOR currency units (0 for non-cash tenders). */
    change: number;
    /** Signed cash-rounding delta applied to the charge, in integer MINOR currency units (positive = rounded up); 0 when the company has no cash-rounding setting. */
    cashRounding: number;
    /** True when this tender settled the cart's remaining balance (the sale completed). */
    saleFinalized: boolean;
    /** Balance still due after this tender, in integer MINOR currency units (0 once the sale is finalized). */
    remainingBalance: number;
}

export type TapToPayPayment = (params?: TapToPayPaymentParams) => Promise<TapToPayPaymentResponse>;

