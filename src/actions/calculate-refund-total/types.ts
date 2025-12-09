import { CFRefundedLineItem, CFRefundedCustomSale } from "../../CommonTypes";

// Calculate Refund Total Types
export interface CalculateRefundTotalResponse {
    success: boolean;
    summary: {
        subtotal: string;
        tax: string;
        total: string;
    };
    refundedLineItems: CFRefundedLineItem[]; // RefundedLineItem[]
    refundedCustomSales: CFRefundedCustomSale[]; // RefundedCustomSale[]
    timestamp: string;
}

export type CalculateRefundTotal = () => Promise<CalculateRefundTotalResponse>;

