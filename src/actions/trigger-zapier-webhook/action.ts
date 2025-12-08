/**
 * Trigger Zapier webhook action
 * Calls the triggerZapierWebhook action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    TriggerZapierWebhook,
    TriggerZapierWebhookParams,
    TriggerZapierWebhookResponse
} from "./types";

export const triggerZapierWebhook: TriggerZapierWebhook = async (params?: TriggerZapierWebhookParams): Promise<TriggerZapierWebhookResponse> => {
    return await commandFrameClient.call<TriggerZapierWebhookParams, TriggerZapierWebhookResponse>("triggerZapierWebhook", params);
};

