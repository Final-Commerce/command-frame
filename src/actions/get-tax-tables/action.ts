/**
 * Get tax tables action — list tax tables for the company.
 */

import { commandFrameClient } from "../../client";
import type { GetTaxTables, GetTaxTablesResponse } from "./types";

export const getTaxTables: GetTaxTables = async (): Promise<GetTaxTablesResponse> => {
    return await commandFrameClient.call<undefined, GetTaxTablesResponse>("getTaxTables");
};
