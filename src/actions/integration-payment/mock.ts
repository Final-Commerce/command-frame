import { mockExtensionPayment } from "../extension-payment/mock";
import type { IntegrationPayment, IntegrationPaymentParams, IntegrationPaymentResponse } from "./types";

export const mockIntegrationPayment: IntegrationPayment = async (params?: IntegrationPaymentParams): Promise<IntegrationPaymentResponse> => {
    return mockExtensionPayment({ ...params, paymentType: "integration" });
};
