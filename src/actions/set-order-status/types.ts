import type { CFOrder, CFOrderCustomStatus } from '../../CommonTypes';
import type { CFStatePair } from '../../common-types/order-state';

export interface SetOrderStatusParams {
  /** Order to set the status on. Omit for the live cart's order. */
  orderId?: string;
  /** Id of one of the company's statuses (see getOrderStatuses), or null to clear the status. */
  statusId: string | null;
}

export interface SetOrderStatusResponse {
  success: boolean;
  orderId: string;
  /** The order's status after the call; null when cleared. */
  customStatus: CFOrderCustomStatus | null;
  /** State before and after — they differ only when the status is bound to a fulfillment state the order wasn't in. */
  from: CFStatePair | null;
  to: CFStatePair | null;
  order: CFOrder;
  timestamp: string;
}

export type SetOrderStatus = (params: SetOrderStatusParams) => Promise<SetOrderStatusResponse>;
