import { AddCartDiscount, AddCartDiscountParams, AddCartDiscountResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockAddCartDiscount: AddCartDiscount = async (params?: AddCartDiscountParams): Promise<AddCartDiscountResponse> => {
    console.log("[Mock] addCartDiscount called", params);
    
    if (params) {
        MOCK_CART.discount = {
            value: params.amount,
            isPercent: params.isPercent,
            label: params.label
        };
        // Simple mock calc (not real logic)
        if (params.isPercent) {
            MOCK_CART.total = MOCK_CART.subtotal * (1 - params.amount / 100);
        } else {
            MOCK_CART.total = MOCK_CART.subtotal - params.amount;
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

