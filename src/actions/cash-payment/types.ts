import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Cash Payment Types
export interface CashPaymentParams {
    /**
     * The amount to pay with this tender, in integer MINOR currency units
     * (e.g. 1575 = $15.75 — see `getContext().minorUnits` for the currency's
     * exponent). Required. Semantics against the cart's balance due:
     *   - missing            → error
     *   - less than balance  → partial payment (the POS enters a fixed
     *                          split-payment leg for this amount)
     *   - equal to balance   → full payment
     *   - more than balance  → error (overpayment is `tenderedAmount`'s job)
     */
    amount: number;
    /**
     * Cash physically handed over by the customer, in integer MINOR currency
     * units. When provided, the POS computes the change itself (after applying
     * the company's cash-rounding setting to the charge) and does NOT open its
     * own change-calculator modal — the flow owns the tender UI. Must be >= the
     * (rounded) charge or the payment fails.
     * Pair with `getCashRoundingAmount` to display the rounded total before
     * collecting the tender.
     */
    tenderedAmount?: number;
    /**
     * @deprecated The change calculator now lives in the flow: call
     * `getCashRoundingAmount`, collect the tender in your own UI, and pass
     * `tenderedAmount` instead. When true (and `tenderedAmount` is absent) the
     * POS still opens its legacy change-calculator modal.
     */
    openChangeCalculator?: boolean;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface CashPaymentResponse {
    success: boolean;
    /** The amount paid with this tender, in integer MINOR currency units. */
    amount: number;
    /** @deprecated Mirror of the deprecated request flag. */
    openChangeCalculator: boolean;
    /**
     * Change due back to the customer in integer MINOR currency units.
     * Non-zero only when `tenderedAmount` exceeded the (cash-rounded) charge.
     * Display this — don't recompute it client-side: it accounts for cash
     * rounding.
     */
    change: number;
    /** Echo of the tendered cash (MINOR units) when it was provided. */
    tenderedAmount?: number;
    /**
     * Signed cash-rounding delta applied to the charge, in integer MINOR
     * currency units (positive = rounded up). 0 when the company has no
     * cash-rounding setting.
     */
    cashRounding: number;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type CashPayment = (params: CashPaymentParams) => Promise<CashPaymentResponse>;
