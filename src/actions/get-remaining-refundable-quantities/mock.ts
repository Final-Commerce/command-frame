import { GetRemainingRefundableQuantities, GetRemainingRefundableQuantitiesResponse } from "./types";

export const mockGetRemainingRefundableQuantities: GetRemainingRefundableQuantities = async (): Promise<GetRemainingRefundableQuantitiesResponse> => {
    console.log("[Mock] getRemainingRefundableQuantities called");
    
    return {
        success: true,
        lineItems: {},
        customSales: {},
        timestamp: new Date().toISOString()
    };
};

