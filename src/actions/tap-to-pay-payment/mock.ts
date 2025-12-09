import { TapToPayPayment, TapToPayPaymentParams, TapToPayPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockTapToPayPayment: TapToPayPayment = async (params?: TapToPayPaymentParams): Promise<TapToPayPaymentResponse> => {
    console.log("[Mock] tapToPayPayment called", params);
    
    return {
        success: true,
        amount: params?.amount || null,
        paymentType: "tapToPay",
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

