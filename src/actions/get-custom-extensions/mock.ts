import { GetCustomExtensions, GetCustomExtensionsResponse } from "./types";

export const mockGetCustomExtensions: GetCustomExtensions = async (): Promise<GetCustomExtensionsResponse> => {
    console.log("[Mock] getCustomExtensions called");
    
    return {
        success: true,
        customExtensions: [],
        timestamp: new Date().toISOString()
    };
};

