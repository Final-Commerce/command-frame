import { CashPayment, CashPaymentParams, CashPaymentResponse } from "./types";
import { createOrderFromCart } from "../../demo/database";

export const mockCashPayment: CashPayment = async (params?: CashPaymentParams): Promise<CashPaymentResponse> => {
    console.log("[Mock] cashPayment called", params);
    
    const amount = params?.amount || 0;
    const order = createOrderFromCart("cash", amount, "cash");

    return {
        success: true,
        amount,
        openChangeCalculator: params?.openChangeCalculator || false,
        paymentType: "cash",
        order,
        timestamp: new Date().toISOString()
    };
};
