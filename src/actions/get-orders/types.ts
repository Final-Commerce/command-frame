import { CFOrder } from "../../CommonTypes";

// Get Orders Types
export interface GetOrdersParams {
    /** e.g. 'completed', 'parked', 'refunded'. */
    status?: string;
    customerId?: string;
    sessionId?: string;
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

