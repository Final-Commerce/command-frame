import { TerminalPayment, TerminalPaymentParams, TerminalPaymentResponse } from "./types";
import { applyMockPayment, MOCK_CART } from "../../demo/database";

export const mockTerminalPayment: TerminalPayment = async (params?: TerminalPaymentParams): Promise<TerminalPaymentResponse> => {
    console.log("[Mock] terminalPayment called", params);

    const connectionType = params?.paymentType || "Cloud";

    // Simulate terminal interaction
    window.alert(`Demo: Processing ${connectionType} Terminal Payment...\n(Please tap, insert, or swipe card on terminal)`);

    const due = params?.amount ?? MOCK_CART.amountToBeCharged ?? MOCK_CART.total;
    const order = applyMockPayment(due, "card", "stripe_terminal");

    return {
        success: true,
        amount: due,
        paymentType: "terminal",
        order,
        timestamp: new Date().toISOString()
    };
};
