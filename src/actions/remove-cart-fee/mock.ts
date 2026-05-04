import type { RemoveCartFee, RemoveCartFeeParams, RemoveCartFeeResponse } from "./types";
import type { CFCustomFee } from "../../CommonTypes";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

function feeContributionToTotal(fee: CFCustomFee, subtotal: number): number {
    if (fee.isPercent) {
        return subtotal * (fee.amount / 100);
    }
    return fee.amount;
}

export const mockRemoveCartFee: RemoveCartFee = (params: RemoveCartFeeParams): Promise<RemoveCartFeeResponse> => {
    console.log("[Mock] removeCartFee called", params);

    const { index } = params;

    if (typeof index !== "number" || !Number.isInteger(index) || index < 0) {
        throw new Error("removeCartFee requires a non-negative integer index");
    }

    const fees = MOCK_CART.customFee;
    if (!fees?.length) {
        throw new Error("Cart has no fees to remove");
    }
    if (index >= fees.length) {
        throw new Error(`Cart fee index ${index} is out of range (0–${fees.length - 1})`);
    }

    const removed = fees[index];
    const delta = feeContributionToTotal(removed, MOCK_CART.subtotal);

    fees.splice(index, 1);
    if (fees.length === 0) {
        MOCK_CART.customFee = undefined;
    }

    MOCK_CART.total -= delta;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    mockPublishEvent("cart", "cart-fee-removed", { feeIndex: index });

    return Promise.resolve({
        success: true,
        timestamp: new Date().toISOString()
    });
};
