// Show Notification Types
export interface ShowNotificationParams {
    message: string;
    /** Visual style when the host supports it (e.g. toast variant). */
    type?: "success" | "error" | "info" | "warning";
}

export interface ShowNotificationResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export type ShowNotification = (params?: ShowNotificationParams) => Promise<ShowNotificationResponse>;

