import type { CFStatePair, CFTransitionResult } from "../../common-types/order-state";

export interface CanTransitionParams {
    /** Order to evaluate. If omitted, evaluates against a new order (from = null). */
    orderId?: string;
    /** Target state pair to transition to. */
    to: CFStatePair;
}

export interface CanTransitionResponse {
    result: CFTransitionResult;
}

export type CanTransition = (params: CanTransitionParams) => Promise<CanTransitionResponse>;
