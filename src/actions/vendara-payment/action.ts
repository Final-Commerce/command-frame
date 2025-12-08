/**
 * Vendara payment action
 * Calls the vendaraPayment action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    VendaraPayment,
    VendaraPaymentParams,
    VendaraPaymentResponse
} from "./types";

export const vendaraPayment: VendaraPayment = async (params?: VendaraPaymentParams): Promise<VendaraPaymentResponse> => {
    return await commandFrameClient.call<VendaraPaymentParams, VendaraPaymentResponse>("vendaraPayment", params);
};

