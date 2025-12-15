import { CalculateRefundTotal, CalculateRefundTotalParams, CalculateRefundTotalResponse } from "./types";

export const mockCalculateRefundTotal: CalculateRefundTotal = async (
    _params?: CalculateRefundTotalParams
): Promise<CalculateRefundTotalResponse> => {
    console.log("[Mock] calculateRefundTotal called", _params);
    
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
