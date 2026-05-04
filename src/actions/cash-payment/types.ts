import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Cash Payment Types
export interface CashPaymentParams {
    /** If not provided, uses the cart total. */
    amount?: number;
    /** Defaults to false. */
    openChangeCalculator?: boolean;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface CashPaymentResponse {
    success: boolean;
    amount: number;
    openChangeCalculator: boolean;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type CashPayment = (params?: CashPaymentParams) => Promise<CashPaymentResponse>;

