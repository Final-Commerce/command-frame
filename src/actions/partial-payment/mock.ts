import { PartialPayment, PartialPaymentParams, PartialPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockPartialPayment: PartialPayment = async (params?: PartialPaymentParams): Promise<PartialPaymentResponse> => {
    console.log("[Mock] partialPayment called", params);
    
    return {
        success: true,
        amount: params?.amount,
        isPercent: params?.isPercent || false,
        openUI: params?.openUI || false,
        order: params?.openUI ? null : MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

