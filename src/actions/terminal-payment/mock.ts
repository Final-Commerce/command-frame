import { TerminalPayment, TerminalPaymentParams, TerminalPaymentResponse } from "./types";
import { createOrderFromCart } from "../../demo/database";

export const mockTerminalPayment: TerminalPayment = async (params?: TerminalPaymentParams): Promise<TerminalPaymentResponse> => {
    console.log("[Mock] terminalPayment called", params);
    
    const amount = params?.amount || 0;
    // Mocking terminal payment success immediately
    const order = createOrderFromCart("card", amount, "stripe_terminal");

    return {
        success: true,
        amount: amount,
        paymentType: "terminal",
        order,
        timestamp: new Date().toISOString()
    };
};
