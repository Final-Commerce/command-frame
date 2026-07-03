import { TapToPayPayment, TapToPayPaymentParams, TapToPayPaymentResponse } from "./types";
import { applyMockPayment, MOCK_CART } from "../../demo/database";

export const mockTapToPayPayment: TapToPayPayment = async (params?: TapToPayPaymentParams): Promise<TapToPayPaymentResponse> => {
    console.log("[Mock] tapToPayPayment called", params);

    // Simulate Tap to Pay interaction
    window.alert("Demo: Processing Tap to Pay...\n(Please tap card or device on screen)");

    const due = params?.amount ?? MOCK_CART.amountToBeCharged ?? MOCK_CART.total;
    const order = applyMockPayment(due, "card", "tapToPay");

    return {
        success: true,
        amount: due,
        paymentType: "tapToPay",
        order,
        timestamp: new Date().toISOString()
    };
};
