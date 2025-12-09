import { ProcessPartialRefund, ProcessPartialRefundParams, ProcessPartialRefundResponse } from "./types";

export const mockProcessPartialRefund: ProcessPartialRefund = async (params?: ProcessPartialRefundParams): Promise<ProcessPartialRefundResponse> => {
    console.log("[Mock] processPartialRefund called", params);
    
    return {
        success: true,
        refundId: "mock_refund_id",
        timestamp: new Date().toISOString()
    };
};

