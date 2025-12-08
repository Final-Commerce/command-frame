/**
 * Get products action
 * Calls the getProducts action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetProducts,
    GetProductsParams,
    GetProductsResponse
} from "./types";

export const getProducts: GetProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
    return await commandFrameClient.call<GetProductsParams, GetProductsResponse>("getProducts", params);
};

