import { GetCustomTables, GetCustomTablesResponse } from "./types";

export const mockGetCustomTables: GetCustomTables = async (): Promise<GetCustomTablesResponse> => {
    console.log("[Mock] getCustomTables called");
    
    const mockTables = [
        {
            _id: "custom_table_1",
            name: "users",
            description: "Store user information with fullName, email, and active status",
            metadata: [
                {
                    key: "category",
                    value: "user_data"
                }
            ],
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z"
        },
        {
            _id: "custom_table_2",
            name: "customer_preferences",
            description: "Store customer preferences and settings",
            metadata: [
                {
                    key: "category",
                    value: "customer_data"
                }
            ],
            createdAt: "2024-01-02T08:00:00.000Z",
            updatedAt: "2024-01-02T08:00:00.000Z"
        },
        {
            _id: "custom_table_3",
            name: "loyalty_points",
            description: "Track customer loyalty points",
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

