import { AddCartDiscount, AddCartDiscountParams, AddCartDiscountResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockAddCartDiscount: AddCartDiscount = async (params?: AddCartDiscountParams): Promise<AddCartDiscountResponse> => {
    console.log("[Mock] addCartDiscount called", params);
    
    if (params) {
        // Mirror render: input is raw (50 = 50%, 5 = $5). Store percent as a
        // fraction (0.5) and fixed as minor units (500), like the real handler.
        const minorFactor = 10 ** (MOCK_CART.minorUnits ?? 2);
        const value = params.isPercent ? params.amount / 100 : Math.round(params.amount * minorFactor);
        MOCK_CART.discount = {
            value,
            isPercent: params.isPercent,
            label: params.label
        };
        if (params.isPercent) {
            MOCK_CART.total = MOCK_CART.subtotal * (1 - params.amount / 100);
        } else {
            MOCK_CART.total = MOCK_CART.subtotal - value;
        }
        MOCK_CART.amountToBeCharged = MOCK_CART.total;
        MOCK_CART.remainingBalance = MOCK_CART.total;
        
        // Publish cart-discount-added event
        mockPublishEvent('cart', 'cart-discount-added', { 
            discount: MOCK_CART.discount 
        });
    }

    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        timestamp: new Date().toISOString()
    };
};

