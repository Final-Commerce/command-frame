import { GetCustomTableFields, GetCustomTableFieldsParams, GetCustomTableFieldsResponse } from "./types";
import { MOCK_CUSTOM_TABLE_FIELDS, safeSerialize } from "../../demo/database";

export const mockGetCustomTableFields: GetCustomTableFields = async (
    params: GetCustomTableFieldsParams
): Promise<GetCustomTableFieldsResponse> => {
    console.log("[Mock] getCustomTableFields called with tableId:", params.tableId);
    
    const fields = MOCK_CUSTOM_TABLE_FIELDS.filter(field => field.tableId === params.tableId);
    
    return {
        success: true,
        fields: safeSerialize(fields),
        timestamp: new Date().toISOString()
    };
};

