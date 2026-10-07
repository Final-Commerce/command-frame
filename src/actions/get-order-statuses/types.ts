import type { CFOrderStatusDefinition } from '../../common-types/order-state';

export interface GetOrderStatusesResponse {
  success: boolean;
  /** The company's order statuses, in the order they were defined. Empty when none are defined. */
  statuses: CFOrderStatusDefinition[];
  timestamp: string;
}

export type GetOrderStatuses = () => Promise<GetOrderStatusesResponse>;
