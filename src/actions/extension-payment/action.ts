/**
 * Generic extension payment — host handles wire action `extensionPayment` and routes by `paymentType`.
 */

import { commandFrameClient } from "../../client";
import type { ExtensionPayment, ExtensionPaymentParams, ExtensionPaymentResponse } from "./types";

export const extensionPayment: ExtensionPayment = async (
    params?: ExtensionPaymentParams
): Promise<ExtensionPaymentResponse> => {
    return await commandFrameClient.call<ExtensionPaymentParams, ExtensionPaymentResponse>("extensionPayment", params);
};
