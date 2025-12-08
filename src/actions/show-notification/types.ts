// Show Notification Types
export interface ShowNotificationParams {
    message: string;
}

export interface ShowNotificationResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export type ShowNotification = (params?: ShowNotificationParams) => Promise<ShowNotificationResponse>;

