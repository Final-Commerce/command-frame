import { CFOrder } from '../../CommonTypes';
import type { CFStatePair } from '../../common-types/order-state';

export interface ResumeOrderParams {
  /** The order to load back into the cart. Must be open — see the README for which states resume. */
  orderId: string;
}

export interface ResumeOrderResponse {
  success: boolean;
  /** The resumed order, re-read after the transition. */
  order: CFOrder;
  /** State before resuming. */
  from: CFStatePair;
  /** State after resuming — `draft` when nothing was paid, otherwise the order stays out of the cart states. */
  to: CFStatePair;
  timestamp: string;
}

export type ResumeOrder = (params?: ResumeOrderParams) => Promise<ResumeOrderResponse>;
