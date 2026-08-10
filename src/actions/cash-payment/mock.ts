import { CashPayment, CashPaymentParams, CashPaymentResponse } from "./types";
import { applyMockPayment, MOCK_CART } from "../../demo/database";

export const mockCashPayment: CashPayment = async (params: CashPaymentParams): Promise<CashPaymentResponse> => {
    console.log("[Mock] cashPayment called", params);

    const fail = (reason: string): CashPaymentResponse => {
        console.warn(`[Mock] cashPayment rejected: ${reason}`);
        return {
            success: false,
            amount: 0,
            openChangeCalculator: params?.openChangeCalculator ?? false,
            change: 0,
            cashRounding: 0,
            paymentType: "cash",
            order: null,
            timestamp: new Date().toISOString()
        };
    };

    // Contract: `amount` is required, integer MINOR currency units — same
    // scale as the mock cart's totals, so comparisons are direct.
    if (params?.amount === undefined || params.amount === null) {
        return fail("amount is required (integer minor currency units)");
    }
    const balanceDue = MOCK_CART.amountToBeCharged ?? MOCK_CART.total;
    if (params.amount > balanceDue) {
        return fail(`amount ${params.amount} exceeds balance due ${balanceDue}`);
    }

    // Flow-owned tender: compute change here (no rounding in the mock).
    let change = 0;
    if (params.tenderedAmount !== undefined) {
        if (params.tenderedAmount < params.amount) {
            return fail(`tenderedAmount ${params.tenderedAmount} is less than amount ${params.amount}`);
        }
        change = params.tenderedAmount - params.amount;
    } else if (params.openChangeCalculator) {
        // Deprecated legacy path: simulate the POS-owned change calculator.
        try {
            const input = window.prompt(
                `Amount due: $${(params.amount / 100).toFixed(2)}\nEnter amount tendered (dollars):`,
                (params.amount / 100).toFixed(2)
            );
            if (input === null) return fail("cancelled");
            const tendered = parseFloat(input);
            if (!isNaN(tendered)) change = Math.round(tendered * 100) - params.amount;
        } catch (e) {
            console.warn("Could not open prompt/alert (possibly in non-interactive environment)", e);
        }
    }

    const order = applyMockPayment(params.amount, "cash", "cash");

    return {
        success: true,
        amount: params.amount,
        openChangeCalculator: params.openChangeCalculator ?? false,
        change,
        tenderedAmount: params.tenderedAmount,
        cashRounding: 0,
        paymentType: "cash",
        order,
        timestamp: new Date().toISOString()
    };
};
