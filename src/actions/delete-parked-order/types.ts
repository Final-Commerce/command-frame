import type { CFTransitionResult } from "../../common-types/order-state";

// Delete Parked Order Types
export interface DeleteParkedOrderParams {
    orderId: string;
}

export interface DeleteParkedOrderResponse {
    success: boolean;
    orderId: string;
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type DeleteParkedOrder = (params?: DeleteParkedOrderParams) => Promise<DeleteParkedOrderResponse>;

