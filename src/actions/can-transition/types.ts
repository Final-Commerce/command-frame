import type { CFStatePair, CFTransitionResult } from '../../common-types/order-state';

export interface CanTransitionParams {
  /** Order to evaluate. Defaults to the active order; if there is no active order (or none matches), evaluates as a brand-new order (from = null). */
  orderId?: string;
  /** Target state pair to transition to. */
  to: CFStatePair;
}

export interface CanTransitionResponse {
  result: CFTransitionResult;
}

export type CanTransition = (params: CanTransitionParams) => Promise<CanTransitionResponse>;
