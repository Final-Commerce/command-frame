// Process Partial Refund Types
export interface ProcessPartialRefundParams {
    reason?: string; // Optional refund reason
}

export interface ProcessPartialRefundResponse {
    success: boolean;
    refundId: string;
    timestamp: string;
}

export type ProcessPartialRefund = (params?: ProcessPartialRefundParams) => Promise<ProcessPartialRefundResponse>;

