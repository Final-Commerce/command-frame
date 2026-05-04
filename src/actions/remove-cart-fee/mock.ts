import { RemoveCartFee, RemoveCartFeeResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveCartFee: RemoveCartFee = async (params): Promise<RemoveCartFeeResponse> => {
    console.log("[Mock] removeCartFee called", params);

    if (MOCK_CART.customFee && params.index >= 0 && params.index < MOCK_CART.customFee.length) {
        const fee = MOCK_CART.customFee[params.index];
        const feeAmount = fee.isPercent
            ? MOCK_CART.subtotal * (fee.amount / 100)
            : fee.amount;

        MOCK_CART.customFee.splice(params.index, 1);
        MOCK_CART.total -= feeAmount;
        MOCK_CART.amountToBeCharged = MOCK_CART.total;
        MOCK_CART.remainingBalance = MOCK_CART.total;

        mockPublishEvent("cart", "cart-fee-removed", { feeIndex: params.index });
    }

    return {
        success: true,
        timestamp: new Date().toISOString(),
    };
};
