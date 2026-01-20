import { UpsertCustomTableData, UpsertCustomTableDataParams, UpsertCustomTableDataResponse } from "./types";

export const mockUpsertCustomTableData: UpsertCustomTableData = async <T = any>(
    params?: UpsertCustomTableDataParams<T>
): Promise<UpsertCustomTableDataResponse<T>> => {
    console.log("[Mock] upsertCustomTableData called", params);
    
    const data = params?.data as any;
    const now = new Date().toISOString();
    
    // Return the data with _id and timestamps added
    const resultData = {
        ...data,
        _id: data?._id || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: data?.createdAt || now,
        updatedAt: now
    };
    
    return {
        success: true,
        data: resultData as T,
        timestamp: now
    };
};

