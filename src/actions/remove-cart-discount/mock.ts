import { RemoveCartDiscount, RemoveCartDiscountResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveCartDiscount: RemoveCartDiscount = async (): Promise<RemoveCartDiscountResponse> => {
    console.log("[Mock] removeCartDiscount called");

    if (MOCK_CART.discount) {
        delete MOCK_CART.discount;
        MOCK_CART.total = MOCK_CART.subtotal;
        MOCK_CART.amountToBeCharged = MOCK_CART.subtotal;
        MOCK_CART.remainingBalance = MOCK_CART.subtotal;
        mockPublishEvent("cart", "cart-discount-removed", {});
    }

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};
