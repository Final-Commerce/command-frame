import { AddCartFee, AddCartFeeParams, AddCartFeeResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockAddCartFee: AddCartFee = async (params?: AddCartFeeParams): Promise<AddCartFeeResponse> => {
    console.log("[Mock] addCartFee called", params);
    
    if (params) {
        if (!MOCK_CART.customFee) MOCK_CART.customFee = [];
        // Mirror render: input is raw (50 = 50%, 5 = $5). Store percent as a
        // fraction (0.5) and fixed as minor units (500), like the real handler.
        const minorFactor = 10 ** (MOCK_CART.minorUnits ?? 2);
        const storedAmount = params.isPercent ? params.amount / 100 : Math.round(params.amount * minorFactor);
        MOCK_CART.customFee.push({
            label: params.label || "Fee",
            amount: storedAmount,
            isPercent: params.isPercent || false,
            applyTaxes: params.applyTaxes || false,
            taxTableId: params.taxTableId
        });

        const feeAmount = params.isPercent ? MOCK_CART.subtotal * (params.amount / 100) : storedAmount;
        MOCK_CART.total += feeAmount;
        MOCK_CART.amountToBeCharged = MOCK_CART.total;
        MOCK_CART.remainingBalance = MOCK_CART.total;
    }

    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        applyTaxes: params?.applyTaxes || false,
        timestamp: new Date().toISOString()
    };
};

