import { GetCustomTables, GetCustomTablesResponse } from "./types";

export const mockGetCustomTables: GetCustomTables = async (): Promise<GetCustomTablesResponse> => {
    console.log("[Mock] getCustomTables called");
    
    return {
        success: true,
        customTables: [],
        timestamp: new Date().toISOString()
    };
};

