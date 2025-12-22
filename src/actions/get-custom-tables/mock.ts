import { GetCustomTables, GetCustomTablesResponse } from "./types";
import { MOCK_CUSTOM_TABLES, safeSerialize } from "../../demo/database";

export const mockGetCustomTables: GetCustomTables = async (): Promise<GetCustomTablesResponse> => {
    console.log("[Mock] getCurrentCart called");
    
    return {
        success: true,
        customTables: safeSerialize(MOCK_CUSTOM_TABLES),
        timestamp: new Date().toISOString()
    };
};
