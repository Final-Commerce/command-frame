/**
 * Redeem payment — thin wrapper over {@link extensionPayment} with `paymentType: "redeem"`.
 */

import { extensionPayment } from "../extension-payment/action";
import type { RedeemPayment, RedeemPaymentParams, RedeemPaymentResponse } from "./types";

export const redeemPayment: RedeemPayment = async (params?: RedeemPaymentParams): Promise<RedeemPaymentResponse> => {
    return extensionPayment({ ...params, paymentType: "redeem" });
};
