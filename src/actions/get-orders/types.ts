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
   * Only orders this user is assigned to now (a current `assignedUser` entry), e.g. a driver's deliveries.
   * `null`: only orders nobody is assigned to now (e.g. deliveries awaiting a driver).
   */
  assignedUserId?: string | null;
  /**
   * Narrows the assignee test to assignments with this label, e.g. 'delivery': with `assignedUserId`, that
   * user must hold the order under this label; with `assignedUserId: null`, nobody holds it under this label;
   * alone, someone holds it under this label. `null` means unlabeled assignments.
   */
  assignedUserLabel?: string | null;
  /**
   * true: only orders loaded in a cart; false: only orders that aren't. Reads `order.inCart` when the order
   * carries it, otherwise the legacy reading (fulfillment 'draft' / status 'in-cart').
   */
  inCart?: boolean;
  /** Order type label(s) set with setOrderType, e.g. 'delivery' or ['pickup', 'takeout']. Exact match; a list matches any. */
  orderType?: string | string[];
  /** Custom status key(s) set with setOrderStatus, e.g. 'in-kitchen'. A list matches any of them. */
  customStatusKey?: string | string[];
  /**
   * Durable custom status id(s) (getOrderStatuses `id`). Also matches a status's key, for
   * flows written before keys — prefer `customStatusKey`. A list matches any of them.
   */
  customStatusId?: string | string[];
  /** true: only orders with a time (setScheduledFor); false: only "as soon as possible" orders (no time). */
  scheduled?: boolean;
  /** Only orders scheduled at or after this ISO 8601 date-time. Orders with no time never match. */
  scheduledFrom?: string;
  /** Only orders scheduled at or before this ISO 8601 date-time. Orders with no time never match. */
  scheduledTo?: string;
  /** Default: 50. */
  limit?: number;
  /** Default: 0. */
  offset?: number;
  searchValue?: string;
  /** Default: 'createdAt'. 'scheduledFor' sorts by the customer's requested time — orders with no time come first ascending. */
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
