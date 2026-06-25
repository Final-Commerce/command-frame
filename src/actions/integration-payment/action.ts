/**
 * Integration payment — thin wrapper over {@link extensionPayment} with `paymentType: "integration"`.
 */

import { extensionPayment } from "../extension-payment/action";
import type { IntegrationPayment, IntegrationPaymentParams, IntegrationPaymentResponse } from "./types";

export const integrationPayment: IntegrationPayment = async (params?: IntegrationPaymentParams): Promise<IntegrationPaymentResponse> => {
    return extensionPayment({ ...params, paymentType: "integration" });
};
