import { OpenPopup, OpenPopupParams, OpenPopupResponse } from "./types";

export const mockOpenPopup: OpenPopup = async (params?: OpenPopupParams): Promise<OpenPopupResponse> => {
    console.log("[Mock] openPopup called", params);
    
    return {
        success: true,
        popupId: params?.popupId || "",
        timestamp: new Date().toISOString()
    };
};

