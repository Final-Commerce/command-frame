/**
 * Add custom sale action
 * Calls the addCustomSale action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddCustomSale,
    AddCustomSaleParams,
    AddCustomSaleResponse
} from "./types";

export const addCustomSale: AddCustomSale = async (params?: AddCustomSaleParams): Promise<AddCustomSaleResponse> => {
    return await commandFrameClient.call<AddCustomSaleParams, AddCustomSaleResponse>("addCustomSale", params);
};

