import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

// Park Order Types
export interface ParkOrderResponse {
    success: boolean;
    order: CFOrder; // ActiveOrder
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type ParkOrder = () => Promise<ParkOrderResponse>;

