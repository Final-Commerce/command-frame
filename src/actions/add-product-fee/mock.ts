import { AddProductFee, AddProductFeeParams, AddProductFeeResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockAddProductFee: AddProductFee = async (params?: AddProductFeeParams): Promise<AddProductFeeResponse> => {
    console.log("[Mock] addProductFee called", params);
    
    if (params) {
        let item = null;
        if (params.cartItemId) {
            item = MOCK_CART.products.find(p => p.internalId === params.cartItemId);
        } else if (MOCK_CART.products.length > 0) {
            item = MOCK_CART.products[MOCK_CART.products.length - 1];
        }

        if (item) {
            item.fee = {
                label: params.label || "Fee",
                amount: params.amount,
                isPercent: params.isPercent || false,
                applyTaxes: params.applyTaxes || false
            };
        }
    }

    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        applyTaxes: params?.applyTaxes || false,
        cartItemId: params?.cartItemId,
        timestamp: new Date().toISOString()
    };
};
