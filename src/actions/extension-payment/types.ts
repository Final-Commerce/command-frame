import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

/** Params for extension-initiated payments; host routes by `paymentType`. */
export interface ExtensionPaymentParams {
    paymentType: string;
    processor?: string;
    amount?: number;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
}

export interface ExtensionPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null;
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type ExtensionPayment = (params?: ExtensionPaymentParams) => Promise<ExtensionPaymentResponse>;
