import { ExtensionPayment, ExtensionPaymentParams, ExtensionPaymentResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockExtensionPayment: ExtensionPayment = async (
    params?: ExtensionPaymentParams
): Promise<ExtensionPaymentResponse> => {
    const paymentType = params?.paymentType ?? "redeem";

    return {
        success: true,
        amount: params?.amount ?? null,
        paymentType,
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};
