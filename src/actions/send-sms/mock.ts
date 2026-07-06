import { SendSms, SendSmsParams, SendSmsResponse } from "./types";

export const mockSendSms: SendSms = async (params?: SendSmsParams): Promise<SendSmsResponse> => {
    console.log("[Mock] sendSms called", params);

    return {
        success: true,
        channel: "text",
        phone: params?.phone || "+15555550123",
        entityId: params?.refundId || params?.orderId || "mock_order_1",
        type: params?.type || "order",
        timestamp: new Date().toISOString()
    };
};
