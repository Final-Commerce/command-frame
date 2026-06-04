import type { CFStatePair, CFTransitionResult } from "../../common-types/order-state";

export interface ApplyTransitionParams {
    /** Order to transition. */
    orderId: string;
    /** Target state pair. */
    to: CFStatePair;
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
