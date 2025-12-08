/**
 * Get customers action
 * Calls the getCustomers action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomers,
    GetCustomersParams,
    GetCustomersResponse
} from "./types";

export const getCustomers: GetCustomers = async (params?: GetCustomersParams): Promise<GetCustomersResponse> => {
    return await commandFrameClient.call<GetCustomersParams, GetCustomersResponse>("getCustomers", params);
};

