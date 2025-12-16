// Trigger Webhook Types

export type TriggerWebhookPresetType = 'product' | 'cart' | 'order' | 'customer';

export interface TriggerWebhookParams {
    webhookUrl: string;
    /** Public key for authentication. */
    publicKey?: string;
    /** Defaults to false. */
    presetData?: boolean;
    presetType?: TriggerWebhookPresetType;
    /** Defaults to false. */
    isCustomHook?: boolean;
    customHookData?: string;
    /** 'json' or 'form-urlencoded'. Defaults to 'json'. */
    payloadType?: string;
    dynamicDataFields?: unknown[];
}

export interface TriggerWebhookResponse {
    success: boolean;
    webhookUrl: string;
    timestamp: string;
}

export type TriggerWebhook = (params?: TriggerWebhookParams) => Promise<TriggerWebhookResponse>;
