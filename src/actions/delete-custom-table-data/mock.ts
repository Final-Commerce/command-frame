import { DeleteCustomTableData, DeleteCustomTableDataParams, DeleteCustomTableDataResponse } from "./types";

export const mockDeleteCustomTableData: DeleteCustomTableData = async (
    params?: DeleteCustomTableDataParams
): Promise<DeleteCustomTableDataResponse> => {
    console.log("[Mock] deleteCustomTableData called", params);
    
    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

