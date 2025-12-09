import { AddCartFee, AddCartFeeParams, AddCartFeeResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockAddCartFee: AddCartFee = async (params?: AddCartFeeParams): Promise<AddCartFeeResponse> => {
    console.log("[Mock] addCartFee called", params);
    
    if (params) {
        if (!MOCK_CART.customFee) MOCK_CART.customFee = [];
        MOCK_CART.customFee.push({
            label: params.label || "Fee",
            amount: params.amount,
            isPercent: params.isPercent || false,
            applyTaxes: params.applyTaxes || false,
            taxTableId: params.taxTableId
        });
        
        // Simple calc
        let feeAmount = params.amount;
        if (params.isPercent) {
            feeAmount = MOCK_CART.subtotal * (params.amount / 100);
        }
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

