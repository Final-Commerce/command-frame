/**
 * Get custom extensions action
 * Calls the getCustomExtensions action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomExtensionCustomTables,
    GetCustomExtensionCustomTablesResponse
} from "./types";

export const getCustomExtensionCustomTables: GetCustomExtensionCustomTables = async (): Promise<GetCustomExtensionCustomTablesResponse> => {
    return await commandFrameClient.call<undefined, GetCustomExtensionCustomTablesResponse>("getCustomExtensionCustomTables");
};
