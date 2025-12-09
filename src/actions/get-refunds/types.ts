import { CFRefundItem } from "../../CommonTypes";

// Get Refunds Types
export interface GetRefundsParams {
    orderId?: string;
    sessionId?: string;
    outletId?: string;
    limit?: number;
    offset?: number;
    sortBy?: string; // e.g., 'createdAt'
    sortDirection?: 'asc' | 'desc';
}

export interface GetRefundsResponse {
    success: boolean;
    refunds: CFRefundItem[];
    total: number;
    timestamp: string;
}

export type GetRefunds = (params?: GetRefundsParams) => Promise<GetRefundsResponse>;

