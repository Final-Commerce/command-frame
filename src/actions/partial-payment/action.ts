/**
 * Partial payment action
 * Calls the partialPayment action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    PartialPayment,
    PartialPaymentParams,
    PartialPaymentResponse
} from "./types";

export const partialPayment: PartialPayment = async (params?: PartialPaymentParams): Promise<PartialPaymentResponse> => {
    return await commandFrameClient.call<PartialPaymentParams, PartialPaymentResponse>("partialPayment", params);
};

