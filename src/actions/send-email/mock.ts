import { SendEmail, SendEmailParams, SendEmailResponse } from "./types";

export const mockSendEmail: SendEmail = async (params?: SendEmailParams): Promise<SendEmailResponse> => {
    console.log("[Mock] sendEmail called", params);

    return {
        success: true,
        channel: "email",
        email: params?.email || "mock@example.com",
        entityId: params?.refundId || params?.orderId || "mock_order_1",
        type: params?.type || "order",
        timestamp: new Date().toISOString()
    };
};
