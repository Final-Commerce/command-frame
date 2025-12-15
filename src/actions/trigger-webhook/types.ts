// Trigger Webhook Types

export type TriggerWebhookPresetType = 'product' | 'cart' | 'order' | 'customer';

export interface TriggerWebhookParams {
    webhookUrl: string;
    publicKey?: string;
    presetData?: boolean;
    presetType?: TriggerWebhookPresetType;
    isCustomHook?: boolean;
    customHookData?: string;
    payloadType?: string;
    dynamicDataFields?: unknown[];
}

export interface TriggerWebhookResponse {
    success: boolean;
    webhookUrl: string;
    timestamp: string;
}

export type TriggerWebhook = (params?: TriggerWebhookParams) => Promise<TriggerWebhookResponse>;
