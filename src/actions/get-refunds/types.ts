import { CFRefundItem } from "../../CommonTypes";

// Get Refunds Types
export interface GetRefundsParams {
    orderId?: string;
    sessionId?: string;
    outletId?: string;
    /** No default — when omitted, all matching refunds are returned. */
    limit?: number;
    /** Default: 0. */
    offset?: number;
    /** Default: 'createdAt'. */
    sortBy?: string; // e.g., 'createdAt'
    /** Default: 'desc'. */
    sortDirection?: 'asc' | 'desc';
}

export interface GetRefundsResponse {
    success: boolean;
    refunds: CFRefundItem[];
    total: number;
    timestamp: string;
}

export type GetRefunds = (params?: GetRefundsParams) => Promise<GetRefundsResponse>;

