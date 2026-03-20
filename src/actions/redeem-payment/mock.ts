import { mockExtensionPayment } from "../extension-payment/mock";
import type { RedeemPayment, RedeemPaymentParams, RedeemPaymentResponse } from "./types";

export const mockRedeemPayment: RedeemPayment = async (params?: RedeemPaymentParams): Promise<RedeemPaymentResponse> => {
    return mockExtensionPayment({ ...params, paymentType: "redeem" });
};
