import { ShowNotification, ShowNotificationParams, ShowNotificationResponse } from "./types";

export const mockShowNotification: ShowNotification = async (params?: ShowNotificationParams): Promise<ShowNotificationResponse> => {
    console.log("[Mock] showNotification called", params);
    
    return {
        success: true,
        message: params?.message || "",
        timestamp: new Date().toISOString()
    };
};

