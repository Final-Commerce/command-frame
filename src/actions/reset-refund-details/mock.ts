import { ResetRefundDetails, ResetRefundDetailsResponse } from "./types";

export const mockResetRefundDetails: ResetRefundDetails = async (): Promise<ResetRefundDetailsResponse> => {
    console.log("[Mock] resetRefundDetails called");
    
    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

