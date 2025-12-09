import { UpdateCustomerFacingDisplay, UpdateCustomerFacingDisplayParams, UpdateCustomerFacingDisplayResponse } from "./types";

export const mockUpdateCustomerFacingDisplay: UpdateCustomerFacingDisplay = async (params?: UpdateCustomerFacingDisplayParams): Promise<UpdateCustomerFacingDisplayResponse> => {
    console.log("[Mock] updateCustomerFacingDisplay called", params);
    
    return {
        success: true,
        pageId: params?.pageId || "",
        timestamp: new Date().toISOString()
    };
};

