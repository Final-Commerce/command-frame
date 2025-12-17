import { CFRefundedLineItem, CFRefundedCustomSale } from "../../CommonTypes";

// Calculate Refund Total Types
export interface CalculateRefundTotalParams {
    /** Optional order ID to set as the active order context for the calculation. */
    orderId?: string;
}

export interface CalculateRefundTotalResponse {
    success: boolean;
    summary: {
        /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
        subtotal: string;
        /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
        tax: string;
        /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
        total: string;
    };
    refundedLineItems: CFRefundedLineItem[]; // RefundedLineItem[]
    refundedCustomSales: CFRefundedCustomSale[]; // RefundedCustomSale[]
    timestamp: string;
}

export type CalculateRefundTotal = (params?: CalculateRefundTotalParams) => Promise<CalculateRefundTotalResponse>;
