import { CFOrder } from '../../CommonTypes';

// Get Orders Types
export interface GetOrdersParams {
  /** e.g. 'completed', 'parked', 'refunded'. */
  status?: string;
  customerId?: string;
  sessionId?: string;
  /** Payment state(s), e.g. 'paid' or ['unpaid', 'partially_paid']. A list matches any of them. */
  paymentState?: string | string[];
  /** Fulfillment state(s), e.g. 'in_progress' or ['pending', 'in_progress']. A list matches any of them. */
  fulfillmentState?: string | string[];
  /** Only orders placed at this outlet (`posData.outlet`). Without it, orders from every outlet in the company are returned. */
  outletId?: string;
  /** Default: 50. */
  limit?: number;
  /** Default: 0. */
  offset?: number;
  searchValue?: string;
  /** Default: 'createdAt'. */
  sortBy?: string;
  /** Default: 'descending'. */
  sortDirection?: 'ascending' | 'descending';
}

export interface GetOrdersResponse {
  success: boolean;
  orders: CFOrder[];
  total: number;
  timestamp: string;
}

export type GetOrders = (params?: GetOrdersParams) => Promise<GetOrdersResponse>;
