import { PartialPayment, PartialPaymentParams, PartialPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockPartialPayment: PartialPayment = async (params?: PartialPaymentParams): Promise<PartialPaymentResponse> => {
    console.log("[Mock] partialPayment called", params);
    
    const openUI = params?.openUI ?? true;

    if (openUI) {
        // Simulate UI opening
        window.alert("Demo: Split Payment UI would open here.");
    }

    return {
        success: true,
        amount: params?.amount,
        isPercent: params?.isPercent || false,
        openUI,
        order: openUI ? null : MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

