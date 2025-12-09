import { CashPayment, CashPaymentParams, CashPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockCashPayment: CashPayment = async (params?: CashPaymentParams): Promise<CashPaymentResponse> => {
    console.log("[Mock] cashPayment called", params);
    
    return {
        success: true,
        amount: params?.amount || 0,
        openChangeCalculator: params?.openChangeCalculator || false,
        paymentType: "cash",
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

