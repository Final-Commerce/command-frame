/**
 * Cash payment action
 * Calls the cashPayment action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    CashPayment,
    CashPaymentParams,
    CashPaymentResponse
} from "./types";

export const cashPayment: CashPayment = async (params: CashPaymentParams): Promise<CashPaymentResponse> => {
    // NOTE: beta.6 defaulted `openChangeCalculator` to true here. The change
    // calculator is deprecated (the flow owns the tender UI via
    // `tenderedAmount` + `getCashRoundingAmount`), so the flag now passes
    // through as-sent and defaults to false host-side.
    return await commandFrameClient.call<CashPaymentParams, CashPaymentResponse>("cashPayment", params);
};
