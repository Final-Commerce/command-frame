// Initiate Refund Types
export interface InitiateRefundParams {
    orderId?: string;
}

export interface InitiateRefundResponse {
    success: boolean;
    orderId: string;
    timestamp: string;
}

export type InitiateRefund = (params?: InitiateRefundParams) => Promise<InitiateRefundResponse>;

