import { CFOrder } from "../../CommonTypes";

// Get Orders Types
export interface GetOrdersParams {
    status?: string; // e.g., 'completed', 'parked', 'refunded', 'partial-refund'
    customerId?: string;
    sessionId?: string;
    limit?: number;
    offset?: number;
    searchValue?: string;
    sortBy?: string; // e.g., 'createdAt', 'total', 'receiptId'
    sortDirection?: 'ascending' | 'descending';
}

export interface GetOrdersResponse {
    success: boolean;
    orders: CFOrder[];
    total: number;
    timestamp: string;
}

export type GetOrders = (params?: GetOrdersParams) => Promise<GetOrdersResponse>;

