import {
    GetCashRoundingAmount,
    GetCashRoundingAmountParams,
    GetCashRoundingAmountResponse
} from "./types";
import { MOCK_CART } from "../../demo/database";

/** Mock rounds to the nearest 5 minor units (a typical $0.05 cash-rounding setting). */
const MOCK_INCREMENT_MINOR = 5;

export const mockGetCashRoundingAmount: GetCashRoundingAmount = async (
    params?: GetCashRoundingAmountParams
): Promise<GetCashRoundingAmountResponse> => {
    console.log("[Mock] getCashRoundingAmount called", params);

    const amount = Math.round(params?.amount ?? MOCK_CART.amountToBeCharged ?? MOCK_CART.total);
    const roundedAmount = Math.round(amount / MOCK_INCREMENT_MINOR) * MOCK_INCREMENT_MINOR;

    return {
        success: true,
        amount,
        roundedAmount,
        cashRounding: roundedAmount - amount,
        timestamp: new Date().toISOString()
    };
};
