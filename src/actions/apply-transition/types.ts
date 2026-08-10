import type { CFStatePair, CFTransitionResult } from "../../common-types/order-state";

export interface ApplyTransitionParams {
    /** Order to transition. Omit to target the active order — materializing one from the live cart if none exists. */
    orderId?: string;
    /** Target fulfillment state. The payment axis is never client-settable. */
    targetFulfillmentState: string;
    /** Clear the terminal after transitioning the ACTIVE order (park parity). Default true. */
    clearTerminal?: boolean;
}

export interface ApplyTransitionResponse {
    result: CFTransitionResult;
    /** Previous state — present only when the transition was applied. */
    from?: CFStatePair;
    /** New state — present only when the transition was applied. */
    to?: CFStatePair;
    /** Computed display label — present only when the transition was applied. */
    displayState?: string;
}

export type ApplyTransition = (params: ApplyTransitionParams) => Promise<ApplyTransitionResponse>;
