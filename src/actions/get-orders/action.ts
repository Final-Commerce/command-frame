/**
 * Get orders action
 * Calls the getOrders action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetOrders,
    GetOrdersParams,
    GetOrdersResponse
} from "./types";

export const getOrders: GetOrders = async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
    return await commandFrameClient.call<GetOrdersParams, GetOrdersResponse>("getOrders", params);
};

