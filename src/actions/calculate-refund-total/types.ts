// Calculate Refund Total Types
export interface CalculateRefundTotalResponse {
    success: boolean;
    summary: {
        subtotal: string;
        tax: string;
        total: string;
    };
    refundedLineItems: any[]; // RefundedLineItem[]
    refundedCustomSales: any[]; // RefundedCustomSale[]
    timestamp: string;
}

export type CalculateRefundTotal = () => Promise<CalculateRefundTotalResponse>;

