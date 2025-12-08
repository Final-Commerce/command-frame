// Trigger Zapier Webhook Types
export interface TriggerZapierWebhookParams {
    triggerUrl: string;
}

export interface TriggerZapierWebhookResponse {
    success: boolean;
    triggerUrl: string;
    timestamp: string;
}

export type TriggerZapierWebhook = (params?: TriggerZapierWebhookParams) => Promise<TriggerZapierWebhookResponse>;

