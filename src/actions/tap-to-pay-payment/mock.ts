import { TapToPayPayment, TapToPayPaymentParams, TapToPayPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockTapToPayPayment: TapToPayPayment = async (params?: TapToPayPaymentParams): Promise<TapToPayPaymentResponse> => {
    console.log("[Mock] tapToPayPayment called", params);
    
    // Simulate Tap to Pay interaction
    window.alert("Demo: Processing Tap to Pay...\n(Please tap card or device on screen)");

    return {
        success: true,
        amount: params?.amount || null,
        paymentType: "tapToPay",
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

