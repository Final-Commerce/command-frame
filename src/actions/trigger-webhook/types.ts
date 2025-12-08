// Trigger Webhook Types
export interface TriggerWebhookParams {
    webhookUrl: string;
    publicKey?: string;
    presetData?: boolean;
    presetType?: string;
    isCustomHook?: boolean;
    customHookData?: string;
    payloadType?: string;
    dynamicDataFields?: any[];
}

export interface TriggerWebhookResponse {
    success: boolean;
    webhookUrl: string;
    timestamp: string;
}

export type TriggerWebhook = (params?: TriggerWebhookParams) => Promise<TriggerWebhookResponse>;

