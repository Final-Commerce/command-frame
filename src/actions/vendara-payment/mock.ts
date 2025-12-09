import { VendaraPayment, VendaraPaymentParams, VendaraPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockVendaraPayment: VendaraPayment = async (params?: VendaraPaymentParams): Promise<VendaraPaymentResponse> => {
    console.log("[Mock] vendaraPayment called", params);
    
    return {
        success: true,
        amount: params?.amount || null,
        paymentType: "vendara",
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

