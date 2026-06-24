import { AddProductFee, AddProductFeeParams, AddProductFeeResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockAddProductFee: AddProductFee = async (params?: AddProductFeeParams): Promise<AddProductFeeResponse> => {
    console.log("[Mock] addProductFee called", params);
    
    if (params) {
        let item = null;
        if (params.internalId) {
            item = MOCK_CART.products.find(p => p.internalId === params.internalId);
        } else if (MOCK_CART.products.length > 0) {
            item = MOCK_CART.products[MOCK_CART.products.length - 1];
        }

        if (item) {
            // Mirror render's product handler: it stores `amount` AS-IS — the flow
            // already sends a fraction (0.5 = 50%) for percent and minor units (500 = $5)
            // for fixed. tax.ts then uses amount as the fraction / minor amount directly.
            item.fee = {
                label: params.label || "Fee",
                amount: params.amount,
                isPercent: params.isPercent || false,
                applyTaxes: params.applyTaxes || false
            };

            const linePrice = (item.price || 0) * (item.quantity || 1);
            const feeMinor = params.isPercent ? Math.round(linePrice * params.amount) : params.amount;
            MOCK_CART.total += feeMinor;
            MOCK_CART.amountToBeCharged = MOCK_CART.total;
            MOCK_CART.remainingBalance = MOCK_CART.total;

            mockPublishEvent("cart", "product-fee-added", { internalId: params.internalId });
        }
    }

    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        applyTaxes: params?.applyTaxes || false,
        internalId: params?.internalId,
        timestamp: new Date().toISOString()
    };
};
