import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Partial Payment Types
export interface PartialPaymentParams {
    /** The payment amount (required if openUI is false). */
    amount?: number;
    /** Defaults to false. */
    isPercent?: boolean;
    /** If true, opens the split payment UI. */
    openUI?: boolean;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface PartialPaymentResponse {
    success: boolean;
    amount?: number;
    isPercent?: boolean;
    openUI: boolean;
    order: CFOrder | null; // ActiveOrder | null (null for split payments until final payment)
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type PartialPayment = (params?: PartialPaymentParams) => Promise<PartialPaymentResponse>;

