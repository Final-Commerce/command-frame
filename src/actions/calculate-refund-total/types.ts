import { CFRefundedLineItem, CFRefundedCustomSale } from "../../CommonTypes";

// Calculate Refund Total Types
export interface CalculateRefundTotalParams {
    /** Optional order ID to set as the active order context for the calculation. */
    orderId?: string;
}

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

export type CalculateRefundTotal = (params?: CalculateRefundTotalParams) => Promise<CalculateRefundTotalResponse>;
