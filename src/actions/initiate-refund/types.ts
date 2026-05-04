import type { CFTransitionResult } from "../../common-types/order-state";

// Initiate Refund Types
export interface InitiateRefundParams {
    /** The ID of the order to refund. If not provided, uses the currently active order. */
    orderId?: string;
}

export interface InitiateRefundResponse {
    success: boolean;
    orderId: string;
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type InitiateRefund = (params?: InitiateRefundParams) => Promise<InitiateRefundResponse>;

