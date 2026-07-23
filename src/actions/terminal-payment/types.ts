import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Terminal Payment Types
export interface TerminalPaymentParams {
    /** If not provided, uses the cart total. */
    amount?: number;
    /** "Bluetooth" or "Cloud". Defaults to "Cloud". */
    paymentType?: "Bluetooth" | "Cloud";
    /** Override the fulfillment landing on full payment. Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. */
    targetFulfillmentState?: string;
}

export interface TerminalPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;
