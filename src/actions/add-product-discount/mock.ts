import { AddProductDiscount, AddProductDiscountParams, AddProductDiscountResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockAddProductDiscount: AddProductDiscount = async (params?: AddProductDiscountParams): Promise<AddProductDiscountResponse> => {
    console.log("[Mock] addProductDiscount called", params);
    
    if (params && (params.amount > 0 || params.amount < 0)) { // Allow 0 to clear discount if logic permits
        let item = null;
        if (params.internalId) {
            item = MOCK_CART.products.find(p => p.internalId === params.internalId);
        } else if (MOCK_CART.products.length > 0) {
            item = MOCK_CART.products[MOCK_CART.products.length - 1];
        }

        if (item) {
            // Mirror render's product handler: it stores `amount` AS-IS — the flow
            // already sends a fraction (0.5 = 50%) for percent and minor units (500 = $5)
            // for fixed. tax.ts then uses value as the fraction / minor amount directly.
            item.discount = {
                value: params.amount,
                isPercent: params.isPercent || false,
                label: params.label
            };

            const linePrice = (item.price || 0) * (item.quantity || 1);
            const discountMinor = params.isPercent ? Math.round(linePrice * params.amount) : params.amount;
            MOCK_CART.total = Math.max(0, MOCK_CART.total - discountMinor);
            MOCK_CART.amountToBeCharged = MOCK_CART.total;
            MOCK_CART.remainingBalance = MOCK_CART.total;

            mockPublishEvent("cart", "product-discount-added", { internalId: params.internalId });
        }
    }

    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        internalId: params?.internalId,
        timestamp: new Date().toISOString()
    };
};
