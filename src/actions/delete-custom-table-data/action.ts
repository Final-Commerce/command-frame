/**
 * Get custom tables action
 * Calls the getCustomTables action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    DeleteCustomTableData,
    DeleteCustomTableDataParams,
    DeleteCustomTableDataResponse
} from "./types";

export const deleteCustomTableData: DeleteCustomTableData = async (params?: DeleteCustomTableDataParams): Promise<DeleteCustomTableDataResponse> => {
    return await commandFrameClient.call<DeleteCustomTableDataParams, DeleteCustomTableDataResponse>("deleteCustomTableData", params);
};
