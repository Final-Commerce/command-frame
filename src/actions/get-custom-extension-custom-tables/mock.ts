import { GetCustomExtensionCustomTables, GetCustomExtensionCustomTablesParams, GetCustomExtensionCustomTablesResponse } from "./types";

export const mockGetCustomExtensionCustomTables: GetCustomExtensionCustomTables = async (params: GetCustomExtensionCustomTablesParams): Promise<GetCustomExtensionCustomTablesResponse> => {
    console.log("[Mock] getCustomExtensionCustomTables called", params);
    
    const mockTables = [
        {
            _id: "custom_table_1",
            name: "users",
            description: "Store user information with fullName, email, and active status",
            metadata: [
                {
                    key: "extensionId",
                    value: params.extensionId
                }
            ],
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z"
        },
        {
            _id: "custom_table_2",
            name: "loyalty_points",
            description: "Track customer loyalty points",
            metadata: [
                {
                    key: "extensionId",
                    value: params.extensionId
                }
            ],
            createdAt: "2024-01-03T09:00:00.000Z",
            updatedAt: "2024-01-03T09:00:00.000Z"
        }
    ];
    
    return {
        success: true,
        customTables: mockTables,
        timestamp: new Date().toISOString()
    };
};

