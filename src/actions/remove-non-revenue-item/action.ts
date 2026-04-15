import { commandFrameClient } from "../../client";
import type { RemoveNonRevenueItem, RemoveNonRevenueItemParams, RemoveNonRevenueItemResponse } from "./types";

export const removeNonRevenueItem: RemoveNonRevenueItem = async (
    params: RemoveNonRevenueItemParams
): Promise<RemoveNonRevenueItemResponse> => {
    return await commandFrameClient.call<RemoveNonRevenueItemParams, RemoveNonRevenueItemResponse>("removeNonRevenueItem", params);
};
