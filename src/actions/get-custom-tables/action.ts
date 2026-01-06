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
