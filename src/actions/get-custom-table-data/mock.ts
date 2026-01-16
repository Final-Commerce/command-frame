import { GetCustomTableData, GetCustomTableDataParams, GetCustomTableDataResponse } from "./types";

export const mockGetCustomTableData: GetCustomTableData = async <T = any>(
    params?: GetCustomTableDataParams
): Promise<GetCustomTableDataResponse<T>> => {
    console.log("[Mock] getCustomTableData called", params);
    
    return {
        success: true,
        data: [],
        timestamp: new Date().toISOString()
    };
};

