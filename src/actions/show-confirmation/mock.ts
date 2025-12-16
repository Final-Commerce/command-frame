import { ShowConfirmation, ShowConfirmationParams, ShowConfirmationResponse } from "./types";

export const mockShowConfirmation: ShowConfirmation = async (params?: ShowConfirmationParams): Promise<ShowConfirmationResponse> => {
    console.log("[Mock] showConfirmation called", params);
    
    const confirmed = window.confirm(`Confirmation Required:\n${params?.message || "Are you sure?"}`);

    if (!confirmed) {
        throw new Error("User cancelled confirmation");
    }

    return {
        success: true,
        message: params?.message || "",
        timestamp: new Date().toISOString()
    };
};

