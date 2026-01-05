/**
 * Get custom tables action
 * Calls the getCustomTables action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    UpsertCustomTableData,
    UpsertCustomTableDataParams,
    UpsertCustomTableDataResponse
} from "./types";

export const upsertCustomTableData: UpsertCustomTableData = async (params?: UpsertCustomTableDataParams): Promise<UpsertCustomTableDataResponse> => {
    return await commandFrameClient.call<UpsertCustomTableDataParams, UpsertCustomTableDataResponse>("upsertCustomTableData", params);
};
