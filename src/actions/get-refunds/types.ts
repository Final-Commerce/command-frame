import { CFRefundItem } from "../../CommonTypes";

// Get Refunds Types
export interface GetRefundsParams {
    orderId?: string;
    sessionId?: string;
    outletId?: string;
    /** Default: 50. */
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

