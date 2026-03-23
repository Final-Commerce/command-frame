import { commandFrameClient } from "../../client";
import type { AddNonRevenueItem, AddNonRevenueItemParams, AddNonRevenueItemResponse } from "./types";

export const addNonRevenueItem: AddNonRevenueItem = async (
    params: AddNonRevenueItemParams
): Promise<AddNonRevenueItemResponse> => {
    return await commandFrameClient.call<AddNonRevenueItemParams, AddNonRevenueItemResponse>("addNonRevenueItem", params);
};
