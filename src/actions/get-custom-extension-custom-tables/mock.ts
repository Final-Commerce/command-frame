import { GetCustomExtensionCustomTables, GetCustomExtensionCustomTablesParams, GetCustomExtensionCustomTablesResponse } from "./types";

export const mockGetCustomExtensionCustomTables: GetCustomExtensionCustomTables = async (params: GetCustomExtensionCustomTablesParams): Promise<GetCustomExtensionCustomTablesResponse> => {
    console.log("[Mock] getCustomExtensionCustomTables called", params);
    
    return {
        success: true,
        customTables: [],
        timestamp: new Date().toISOString()
    };
};

