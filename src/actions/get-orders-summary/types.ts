import type { GetOrdersParams } from '../get-orders/types';

/** The same filters as `getOrders`; paging and sorting do not apply to a summary. */
export type GetOrdersSummaryParams = Omit<GetOrdersParams, 'limit' | 'offset' | 'sortBy' | 'sortDirection'>;

export interface GetOrdersSummaryResponse {
  success: boolean;
  /** Matched orders, leaving out those still in a cart, parked or deleted from park (legacy `status`). */
  orderCount: number;
  /** Σ `summary.total` of those orders, integer MINOR units. */
  ordersTotal: number;
  currency: string;
  minorUnits: number;
  /** Legacy `status === 'completed'`; `percentOfOrders` rounded to a whole percent by the till. */
  completed: { count: number; percentOfOrders: number };
  /** Legacy `status` 'refunded' or 'partial-refund'. */
  refunded: { count: number; percentOfOrders: number };
  timestamp: string;
}

export type GetOrdersSummary = (params?: GetOrdersSummaryParams) => Promise<GetOrdersSummaryResponse>;
