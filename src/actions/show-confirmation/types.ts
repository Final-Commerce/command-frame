// Show Confirmation Types
export interface ShowConfirmationParams {
    message: string;
}

export interface ShowConfirmationResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export type ShowConfirmation = (params?: ShowConfirmationParams) => Promise<ShowConfirmationResponse>;

