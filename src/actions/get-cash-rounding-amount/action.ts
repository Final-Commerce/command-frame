/**
 * Get cash rounding amount action — preview the company's cash rounding for an
 * amount (or the cart's balance due) WITHOUT touching any state. Read-only.
 *
 * Built for flow-owned cash tender UIs: fetch the rounded total, display it,
 * collect the tendered cash, then call `cashPayment({ amount, tenderedAmount })`.
 */

import { commandFrameClient } from "../../client";
import type {
    GetCashRoundingAmount,
    GetCashRoundingAmountParams,
    GetCashRoundingAmountResponse
} from "./types";

export const getCashRoundingAmount: GetCashRoundingAmount = async (
    params?: GetCashRoundingAmountParams
): Promise<GetCashRoundingAmountResponse> => {
    return await commandFrameClient.call<GetCashRoundingAmountParams | undefined, GetCashRoundingAmountResponse>(
        "getCashRoundingAmount",
        params
    );
};
