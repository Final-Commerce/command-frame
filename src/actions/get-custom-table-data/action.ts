/**
 * Get custom table data action
 * Calls the getCustomTableData action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomTableData,
    GetCustomTableDataParams,
    GetCustomTableDataResponse
} from "./types";

export const getCustomTableData: GetCustomTableData = async (params?: GetCustomTableDataParams): Promise<GetCustomTableDataResponse> => {
    return await commandFrameClient.call<GetCustomTableDataParams, GetCustomTableDataResponse>("getCustomTableData", params);
};
