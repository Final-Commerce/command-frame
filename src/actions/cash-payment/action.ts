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

export const cashPayment: CashPayment = async (params?: CashPaymentParams): Promise<CashPaymentResponse> => {
    const finalParams: CashPaymentParams = {
        ...params,
        openChangeCalculator: params?.openChangeCalculator ?? true
    };
    return await commandFrameClient.call<CashPaymentParams, CashPaymentResponse>("cashPayment", finalParams);
};

