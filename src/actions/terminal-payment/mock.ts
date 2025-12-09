import { TerminalPayment, TerminalPaymentParams, TerminalPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockTerminalPayment: TerminalPayment = async (params?: TerminalPaymentParams): Promise<TerminalPaymentResponse> => {
    console.log("[Mock] terminalPayment called", params);
    
    return {
        success: true,
        amount: params?.amount || null,
        paymentType: "terminal",
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

