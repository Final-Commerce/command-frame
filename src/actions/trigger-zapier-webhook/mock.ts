import { TriggerZapierWebhook, TriggerZapierWebhookParams, TriggerZapierWebhookResponse } from "./types";

export const mockTriggerZapierWebhook: TriggerZapierWebhook = async (params?: TriggerZapierWebhookParams): Promise<TriggerZapierWebhookResponse> => {
    console.log("[Mock] triggerZapierWebhook called", params);
    
    return {
        success: true,
        triggerUrl: params?.triggerUrl || "",
        timestamp: new Date().toISOString()
    };
};

