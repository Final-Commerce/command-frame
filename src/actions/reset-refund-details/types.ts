// Reset Refund Details Types
export interface ResetRefundDetailsResponse {
    success: boolean;
    timestamp: string;
}

export type ResetRefundDetails = () => Promise<ResetRefundDetailsResponse>;

