/**
 * Get custom extensions action
 * Calls the getCustomExtensions action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomExtensionCustomTables,
    GetCustomExtensionCustomTablesParams,
    GetCustomExtensionCustomTablesResponse
} from "./types";

export const getCustomExtensionCustomTables: GetCustomExtensionCustomTables = async (params: GetCustomExtensionCustomTablesParams): Promise<GetCustomExtensionCustomTablesResponse> => {
    return await commandFrameClient.call<GetCustomExtensionCustomTablesParams, GetCustomExtensionCustomTablesResponse>("getCustomExtensionCustomTables", params);
};
