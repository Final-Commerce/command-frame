/**
 * Get categories action
 * Calls the getCategories action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCategories,
    GetCategoriesParams,
    GetCategoriesResponse
} from "./types";

export const getCategories: GetCategories = async (params?: GetCategoriesParams): Promise<GetCategoriesResponse> => {
    return await commandFrameClient.call<GetCategoriesParams, GetCategoriesResponse>("getCategories", params);
};

