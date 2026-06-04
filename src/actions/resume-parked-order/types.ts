import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Resume Parked Order Types
export interface ResumeParkedOrderParams {
    orderId: string;
}

export interface ResumeParkedOrderResponse {
    success: boolean;
    order: CFOrder; // ActiveOrder
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type ResumeParkedOrder = (params?: ResumeParkedOrderParams) => Promise<ResumeParkedOrderResponse>;

