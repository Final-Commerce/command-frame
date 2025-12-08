/**
 * Get product variants action
 * Calls the getProductVariants action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetProductVariants,
    GetProductVariantsParams,
    GetProductVariantsResponse
} from "./types";

export const getProductVariants: GetProductVariants = async (params?: GetProductVariantsParams): Promise<GetProductVariantsResponse> => {
    return await commandFrameClient.call<GetProductVariantsParams, GetProductVariantsResponse>("getProductVariants", params);
};

