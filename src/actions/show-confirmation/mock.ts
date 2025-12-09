import { ShowConfirmation, ShowConfirmationParams, ShowConfirmationResponse } from "./types";

export const mockShowConfirmation: ShowConfirmation = async (params?: ShowConfirmationParams): Promise<ShowConfirmationResponse> => {
    console.log("[Mock] showConfirmation called", params);
    
    // Simulate user confirming
    return {
        success: true,
        message: params?.message || "",
        timestamp: new Date().toISOString()
    };
};

