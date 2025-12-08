/**
 * Trigger webhook action
 * Calls the triggerWebhook action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    TriggerWebhook,
    TriggerWebhookParams,
    TriggerWebhookResponse
} from "./types";

export const triggerWebhook: TriggerWebhook = async (params?: TriggerWebhookParams): Promise<TriggerWebhookResponse> => {
    return await commandFrameClient.call<TriggerWebhookParams, TriggerWebhookResponse>("triggerWebhook", params);
};

