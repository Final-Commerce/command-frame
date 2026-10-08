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
  /**
   * Only orders assigned to this user (`assignedUser.userId`), e.g. a driver's deliveries.
   * `null`: only orders nobody is assigned to yet (e.g. deliveries awaiting a driver).
   */
  assignedUserId?: string | null;
  /**
   * true: only orders loaded in a cart; false: only orders that aren't. Reads `order.inCart` when the order
   * carries it, otherwise the legacy reading (fulfillment 'draft' / status 'in-cart').
   */
  inCart?: boolean;
  /** Order type label(s) set with setOrderType, e.g. 'delivery' or ['pickup', 'takeout']. Exact match; a list matches any. */
  orderType?: string | string[];
  /** Custom status id(s) set with setOrderStatus, e.g. 'in-kitchen'. A list matches any of them. */
  customStatusId?: string | string[];
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
