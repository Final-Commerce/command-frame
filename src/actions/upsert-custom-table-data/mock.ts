import { UpsertCustomTableData, UpsertCustomTableDataParams, UpsertCustomTableDataResponse } from "./types";

export const mockUpsertCustomTableData: UpsertCustomTableData = async <T = any>(
    params?: UpsertCustomTableDataParams<T>
): Promise<UpsertCustomTableDataResponse<T>> => {
    console.log("[Mock] upsertCustomTableData called", params);
    
    return {
        success: true,
        data: params?.data as T,
        timestamp: new Date().toISOString()
    };
};

