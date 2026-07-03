import { PartialPayment, PartialPaymentParams, PartialPaymentResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockPartialPayment: PartialPayment = async (params?: PartialPaymentParams): Promise<PartialPaymentResponse> => {
    console.log("[Mock] partialPayment called", params);

    const openUI = params?.openUI ?? true;

    if (openUI) {
        // Split-payment UI is host-owned; nothing to simulate here.
        window.alert("Demo: Split Payment UI would open here.");
        return {
            success: true,
            amount: params?.amount,
            isPercent: params?.isPercent || false,
            openUI,
            order: null,
            timestamp: new Date().toISOString()
        };
    }

    // Queue a partial amount as the next tender. The remaining balance is left
    // untouched until the payment is actually taken (see applyMockPayment).
    const remaining = MOCK_CART.remainingBalance ?? MOCK_CART.total;
    const raw = params?.amount ?? 0;
    // Mirror render: fixed amount is raw dollars (render does toMinorUnits), so
    // convert to minor units here; percent is a percentage of the remaining total.
    const minorFactor = 10 ** (MOCK_CART.minorUnits ?? 2);
    const charge = params?.isPercent ? Math.round((remaining * raw) / 100) : Math.round(raw * minorFactor);
    MOCK_CART.amountToBeCharged = Math.min(Math.max(0, charge), remaining);
    mockPublishEvent("cart", "partial-payment-set", { amountToBeCharged: MOCK_CART.amountToBeCharged });

    return {
        success: true,
        amount: params?.amount,
        isPercent: params?.isPercent || false,
        openUI,
        order: null,
        timestamp: new Date().toISOString()
    };
};
