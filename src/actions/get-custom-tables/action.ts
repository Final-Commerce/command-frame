/**
 * Get custom tables action
 * Calls the getCustomTables action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomTables,
    GetCustomTablesResponse
} from "./types";

export const getCustomTables: GetCustomTables = async (): Promise<GetCustomTablesResponse> => {
    return await commandFrameClient.call<undefined, GetCustomTablesResponse>("getCustomTables");
};


// getCustomTableData(tableName, query, offset, limit) - return data from custom table
// addCustomTableData(tableName, data) - add data to custom table
// updateCustomTableData(tableName, query, data) - update data in custom table
// deleteCustomTableData(tableName, query) - delete data from custom table