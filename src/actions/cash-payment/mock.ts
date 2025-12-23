import { CashPayment, CashPaymentParams, CashPaymentResponse } from "./types";
import { createOrderFromCart, MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockCashPayment: CashPayment = async (params?: CashPaymentParams): Promise<CashPaymentResponse> => {
    console.log("[Mock] cashPayment called", params);
    
    // Default to true to match action behavior
    const openChangeCalculator = params?.openChangeCalculator ?? true;
    let amount = params?.amount || MOCK_CART.total;

    if (openChangeCalculator) {
        try {
            const input = window.prompt(
                `Total Due: $${MOCK_CART.total.toFixed(2)}\nEnter amount tendered:`, 
                amount.toString()
            );

            if (input === null) {
                // User cancelled
                return {
                    success: false,
                    amount: 0,
                    openChangeCalculator,
                    paymentType: "cash",
                    order: null,
                    timestamp: new Date().toISOString()
                };
            }

            const tendered = parseFloat(input);
            if (!isNaN(tendered)) {
                amount = tendered;
                const change = tendered - MOCK_CART.total;
                
                if (change >= 0) {
                    window.alert(`Change Due: $${change.toFixed(2)}`);
                } else {
                    window.alert(`Warning: Tendered amount is less than total. Short by: $${Math.abs(change).toFixed(2)}`);
                }
            }
        } catch (e) {
            console.warn("Could not open prompt/alert (possibly in non-interactive environment)", e);
        }
    }

    const order = createOrderFromCart("cash", amount, "cash");
    
    // Publish payment-done event
    mockPublishEvent('payments', 'payment-done', { order });

    return {
        success: true,
        amount,
        openChangeCalculator,
        paymentType: "cash",
        order,
        timestamp: new Date().toISOString()
    };
};
