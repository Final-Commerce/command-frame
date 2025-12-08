/**
 * Show notification action
 * Calls the showNotification action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ShowNotification,
    ShowNotificationParams,
    ShowNotificationResponse
} from "./types";

export const showNotification: ShowNotification = async (params?: ShowNotificationParams): Promise<ShowNotificationResponse> => {
    return await commandFrameClient.call<ShowNotificationParams, ShowNotificationResponse>("showNotification", params);
};

