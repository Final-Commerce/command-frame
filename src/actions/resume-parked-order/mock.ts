import { ResumeParkedOrder, ResumeParkedOrderParams, ResumeParkedOrderResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockResumeParkedOrder: ResumeParkedOrder = async (params?: ResumeParkedOrderParams): Promise<ResumeParkedOrderResponse> => {
    console.log("[Mock] resumeParkedOrder called", params);
    
    return {
        success: true,
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

