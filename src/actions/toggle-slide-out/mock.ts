import { ToggleSlideOut, ToggleSlideOutParams, ToggleSlideOutResponse } from "./types";

export const mockToggleSlideOut: ToggleSlideOut = async (params?: ToggleSlideOutParams): Promise<ToggleSlideOutResponse> => {
    console.log("[Mock] toggleSlideOut called", params);
    
    return {
        success: true,
        slideOutId: params?.slideOutId || "",
        timestamp: new Date().toISOString()
    };
};

