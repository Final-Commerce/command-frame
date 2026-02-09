import { GetCustomTableFields, GetCustomTableFieldsParams, GetCustomTableFieldsResponse } from "./types";
import { AttributeType } from "../../CommonTypes";

export const mockGetCustomTableFields: GetCustomTableFields = async (params: GetCustomTableFieldsParams): Promise<GetCustomTableFieldsResponse> => {
    console.log("[Mock] getCustomTableFields called", params);
    
    const mockFields = [
        {
            _id: "field_fullname",
            tableId: params.tableId,
            name: "fullName",
            type: AttributeType.STRING,
            required: true,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z"
        },
        {
            _id: "field_email",
            tableId: params.tableId,
            name: "email",
            type: AttributeType.STRING,
            required: true,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z"
        },
        {
            _id: "field_isactive",
            tableId: params.tableId,
            name: "isActive",
            type: AttributeType.BOOLEAN,
            required: true,
            defaultValue: true,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z"
        }
    ];
    
    return {
        success: true,
        fields: mockFields,
        timestamp: new Date().toISOString()
    };
};

