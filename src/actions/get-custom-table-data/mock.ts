import { GetCustomTableData, GetCustomTableDataParams, GetCustomTableDataResponse } from "./types";

export const mockGetCustomTableData: GetCustomTableData = async <T = any>(
    params?: GetCustomTableDataParams
): Promise<GetCustomTableDataResponse<T>> => {
    console.log("[Mock] getCustomTableData called", params);
    
    const mockData = [
        {
            _id: "user_data_1",
            fullName: "John Doe",
            email: "john.doe@example.com",
            isActive: true,
            createdAt: "2024-01-10T10:00:00.000Z",
            updatedAt: "2024-01-10T10:00:00.000Z"
        },
        {
            _id: "user_data_2",
            fullName: "Jane Smith",
            email: "jane.smith@example.com",
            isActive: true,
            createdAt: "2024-01-11T11:00:00.000Z",
            updatedAt: "2024-01-11T11:00:00.000Z"
        },
        {
            _id: "user_data_3",
            fullName: "Bob Johnson",
            email: "bob.johnson@example.com",
            isActive: false,
            createdAt: "2024-01-12T09:00:00.000Z",
            updatedAt: "2024-01-15T14:30:00.000Z"
        }
    ];
    
    return {
        success: true,
        data: mockData as T[],
        timestamp: new Date().toISOString()
    };
};

