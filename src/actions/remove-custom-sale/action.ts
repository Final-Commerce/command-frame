import { commandFrameClient } from "../../client";
import type { RemoveCustomSale, RemoveCustomSaleParams, RemoveCustomSaleResponse } from "./types";

export const removeCustomSale: RemoveCustomSale = async (
    params: RemoveCustomSaleParams
): Promise<RemoveCustomSaleResponse> => {
    return await commandFrameClient.call<RemoveCustomSaleParams, RemoveCustomSaleResponse>("removeCustomSale", params);
};
