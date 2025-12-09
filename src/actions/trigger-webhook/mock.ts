import { TriggerWebhook, TriggerWebhookParams, TriggerWebhookResponse } from "./types";

export const mockTriggerWebhook: TriggerWebhook = async (params?: TriggerWebhookParams): Promise<TriggerWebhookResponse> => {
    console.log("[Mock] triggerWebhook called", params);
    
    return {
        success: true,
        webhookUrl: params?.webhookUrl || "",
        timestamp: new Date().toISOString()
    };
};

