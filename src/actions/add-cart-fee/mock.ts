import { AddCartFee, AddCartFeeParams, AddCartFeeResponse } from "./types";
import { MOCK_CART } from "../../demo/database";
import { percentToFraction, requireMinorUnitsInteger } from "../../demo/units";

export const mockAddCartFee: AddCartFee = async (params?: AddCartFeeParams): Promise<AddCartFeeResponse> => {
    console.log("[Mock] addCartFee called", params);
    
    if (params) {
        if (!MOCK_CART.customFee) MOCK_CART.customFee = [];
        // FI-6991: a fixed amount arrives as an INTEGER in MINOR units (500 =
        // $5.00) and is stored directly; a percent arrives raw (50 = 50%) and is
        // stored as a fraction (0.5). Same as the real handler.
        const storedAmount = params.isPercent
            ? percentToFraction(params.amount)
            : requireMinorUnitsInteger(params.amount, "Fee amount");
        MOCK_CART.customFee.push({
            label: params.label || "Fee",
            amount: storedAmount,
            isPercent: params.isPercent || false,
            applyTaxes: params.applyTaxes || false,
            taxTableId: params.taxTableId
        });

        const feeAmount = params.isPercent ? MOCK_CART.subtotal * storedAmount : storedAmount;
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

