import { GetCustomExtensionCustomTables, GetCustomExtensionCustomTablesResponse } from "./types";

export const mockGetCustomExtensionCustomTables: GetCustomExtensionCustomTables = async (): Promise<GetCustomExtensionCustomTablesResponse> => {
    console.log("[Mock] getCustomExtensionCustomTables called");
    
    return {
        success: true,
        customTables: [],
        timestamp: new Date().toISOString()
    };
};

