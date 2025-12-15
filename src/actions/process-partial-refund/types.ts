// Process Partial Refund Types
export interface ProcessPartialRefundParams {
    reason?: string; // Optional refund reason
    orderId?: string; // Optional: specify which order to refund (sets it as active)
    items?: {
        itemKey: string; // internalId or variantId or customSaleId
        quantity: number;
        type?: 'product' | 'customSale' | 'fee' | 'tip'; // Optional type hint
    }[];
}

export interface ProcessPartialRefundResponse {
    success: boolean;
    refundId: string;
    timestamp: string;
}

export type ProcessPartialRefund = (params?: ProcessPartialRefundParams) => Promise<ProcessPartialRefundResponse>;
