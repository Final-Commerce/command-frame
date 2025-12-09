import { CalculateRefundTotal, CalculateRefundTotalResponse } from "./types";

export const mockCalculateRefundTotal: CalculateRefundTotal = async (): Promise<CalculateRefundTotalResponse> => {
    console.log("[Mock] calculateRefundTotal called");
    
    return {
        success: true,
        summary: {
            subtotal: "0.00",
            tax: "0.00",
            total: "0.00"
        },
        refundedLineItems: [],
        refundedCustomSales: [],
        timestamp: new Date().toISOString()
    };
};

