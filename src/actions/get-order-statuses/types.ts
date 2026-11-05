import type { CFOrderStatusDefinition } from '../../common-types/order-state';

export interface GetOrderStatusesResponse {
  success: boolean;
  /** The running flow's order statuses, in the order they were defined. Empty when it defines none. */
  statuses: CFOrderStatusDefinition[];
  timestamp: string;
}

export type GetOrderStatuses = () => Promise<GetOrderStatusesResponse>;
