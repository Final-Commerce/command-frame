// Open Popup Types
export interface OpenPopupParams {
    popupId: string;
}

export interface OpenPopupResponse {
    success: boolean;
    popupId: string;
    timestamp: string;
}

export type OpenPopup = (params?: OpenPopupParams) => Promise<OpenPopupResponse>;

