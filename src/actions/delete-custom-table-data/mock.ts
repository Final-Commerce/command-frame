import { DeleteCustomTableData, DeleteCustomTableDataParams, DeleteCustomTableDataResponse } from "./types";
import { assertMockCustomTableWriteNotDeclined } from "../../demo/database";

export const mockDeleteCustomTableData: DeleteCustomTableData = async (
    params?: DeleteCustomTableDataParams
): Promise<DeleteCustomTableDataResponse> => {
    console.log("[Mock] deleteCustomTableData called", params);
    assertMockCustomTableWriteNotDeclined(params?.tableName ?? "");

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};
