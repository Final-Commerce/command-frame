import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Vendara Payment Types
export interface VendaraPaymentParams {
    /** If not provided, uses the cart total. */
    amount?: number;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface VendaraPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type VendaraPayment = (params?: VendaraPaymentParams) => Promise<VendaraPaymentResponse>;

