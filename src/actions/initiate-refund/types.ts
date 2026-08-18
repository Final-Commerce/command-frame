// Initiate Refund Types
export interface InitiateRefundParams {
    /** The ID of the order to refund. If not provided, uses the currently active order. */
    orderId?: string;
}

export interface InitiateRefundResponse {
    success: boolean;
    orderId: string;
    timestamp: string;
}

export type InitiateRefund = (params?: InitiateRefundParams) => Promise<InitiateRefundResponse>;

