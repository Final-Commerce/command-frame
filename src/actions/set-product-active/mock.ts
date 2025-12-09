import { SetProductActive, SetProductActiveParams, SetProductActiveResponse } from "./types";

export const mockSetProductActive: SetProductActive = async (params?: SetProductActiveParams): Promise<SetProductActiveResponse> => {
    console.log("[Mock] setProductActive called", params);
    
    return {
        success: true,
        variantId: params?.variantId || "",
        timestamp: new Date().toISOString()
    };
};

