import type { CFAvailableTransition } from "../../common-types/order-state";

export interface GetAvailableTransitionsParams {
    /** Order to evaluate. Required — we need the current state. */
    orderId: string;
}

export interface GetAvailableTransitionsResponse {
    transitions: CFAvailableTransition[];
}

export type GetAvailableTransitions = (
    params: GetAvailableTransitionsParams
) => Promise<GetAvailableTransitionsResponse>;
