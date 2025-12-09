import { InitiateRefund, InitiateRefundParams, InitiateRefundResponse } from "./types";

export const mockInitiateRefund: InitiateRefund = async (params?: InitiateRefundParams): Promise<InitiateRefundResponse> => {
    console.log("[Mock] initiateRefund called", params);
    
    return {
        success: true,
        orderId: params?.orderId || "mock_order_id",
        timestamp: new Date().toISOString()
    };
};

