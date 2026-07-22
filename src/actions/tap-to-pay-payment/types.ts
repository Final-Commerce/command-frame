import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Tap to Pay Payment Types
export interface TapToPayPaymentParams {
    /**
     * The amount to pay with this tender, in integer MINOR currency units
     * (e.g. 1575 = $15.75). Required. Semantics against the cart's balance due:
     *   - missing            → error
     *   - less than balance  → partial payment (the POS enters a fixed
     *                          split-payment leg for this amount)
     *   - equal to balance   → full payment
     *   - more than balance  → error
     */
    amount: number;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface TapToPayPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type TapToPayPayment = (params?: TapToPayPaymentParams) => Promise<TapToPayPaymentResponse>;

