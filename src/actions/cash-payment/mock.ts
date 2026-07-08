import { CashPayment, CashPaymentParams, CashPaymentResponse } from "./types";
import { applyMockPayment, MOCK_CART } from "../../demo/database";

export const mockCashPayment: CashPayment = async (params?: CashPaymentParams): Promise<CashPaymentResponse> => {
    console.log("[Mock] cashPayment called", params);

    // Default to true to match action behavior.
    const openChangeCalculator = params?.openChangeCalculator ?? true;
    // Amount due for THIS tender (the queued amount-to-be-charged), in minor units.
    const due = params?.amount ?? MOCK_CART.amountToBeCharged ?? MOCK_CART.total;

    if (openChangeCalculator) {
        try {
            const input = window.prompt(
                `Amount due: $${(due / 100).toFixed(2)}\nEnter amount tendered:`,
                (due / 100).toFixed(2)
            );
            if (input === null) {
                return {
                    success: false,
                    amount: 0,
                    openChangeCalculator,
                    paymentType: "cash",
                    order: null,
                    timestamp: new Date().toISOString()
                };
            }
            const tendered = parseFloat(input); // dollars
            if (!isNaN(tendered)) {
                const change = tendered - due / 100;
                window.alert(change >= 0
                    ? `Change Due: $${change.toFixed(2)}`
                    : `Warning: Tendered is short by: $${Math.abs(change).toFixed(2)}`);
            }
        } catch (e) {
            console.warn("Could not open prompt/alert (possibly in non-interactive environment)", e);
        }
    }

    const order = applyMockPayment(due, "cash", "cash");

    return {
        success: true,
        amount: due,
        openChangeCalculator,
        paymentType: "cash",
        order,
        timestamp: new Date().toISOString()
    };
};
